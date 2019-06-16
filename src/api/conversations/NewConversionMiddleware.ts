import { Middleware, Context } from 'koa';
import * as Boom from 'boom';
import { isNil, sample, template } from 'lodash';
import { Status } from 'lexica-dialog-model/dist/Issue';
import { issueRepository, messageRepository } from 'lexica-dialog-repository';
import {
  ResponseType,
  TextResponse,
} from 'lexica-dialog-model/dist/Message';
import {
  Config,
} from 'lexica-dialog-model/dist/Config';
import { RunTimeConfig } from 'lexica-dialog-core/dist/Api';
import { CONFIG_KEYS } from '../../Constants';

const newConversionMiddleware = () => {
  const middleware: Middleware = async (ctx, next) => {
    const {
      state: {
        user: {
          uni,
        },
      senderInfo: {
          senderId,
        firstName,
        },
      uniConfigs,
      },
    } = ctx;
    const issues = await issueRepository.findByUniAndSenderIdAndStatus(uni, senderId, Status.OPEN);
    ctx.state.issue = issues.length > 0 ? issues[0] : undefined;

    if (!isNil(ctx.state.issue)) {
      const messages = await messageRepository.find({
        issueId: isNil(ctx.state.issue.id) ? '' : ctx.state.issue.id,
        senderId,
        sessionId: { $exists: false },
        uni,
      });

      if (messages.length === 0) {
        const messageTemplates = sample(
          uniConfigs.get(CONFIG_KEYS.PREPEND_MESSAGES_PRIOR_TO_LIBRARIAN_REPLY).value,
        );

        const responseTemplate = template(messageTemplates.response);
        const runTimeConfigTemplate = template(messageTemplates.additional_time_gap_response);

        const response: TextResponse = {
          message: responseTemplate({
            LIBRARIAN_INDICATOR: uniConfigs.get(CONFIG_KEYS.LIBRARIAN_INDICATOR).value,
            firstName,
          }),
          type: ResponseType.TEXT,
        };

        if (uniConfigs.has(RunTimeConfig.TIME_GAP_IN_MS_TRIGGER_CONFIRM_CLOSE_ISSUE)) {
          const ms = uniConfigs.get(
            RunTimeConfig.TIME_GAP_IN_MS_TRIGGER_CONFIRM_CLOSE_ISSUE,
          ).value;
          response.message += '\n';
          response.message += runTimeConfigTemplate({
            RECREATE_ISSUE_KEY_WORD: uniConfigs.get(CONFIG_KEYS.RECREATE_ISSUE_KEY_WORD).value,
            TIME_GAP: ms / 60 / 1000,
          });
        }

        ctx.state.systemMessage = response;
        ctx.state.systemMessageDate = new Date();
      }
    }

    await next();
  };
  return middleware;
};

export {
  newConversionMiddleware,
};
