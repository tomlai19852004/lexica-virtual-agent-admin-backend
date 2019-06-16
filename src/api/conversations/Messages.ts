import * as Router from 'koa-router';
import * as Boom from 'boom';
import { List, Map } from 'immutable';
import { omit, omitBy, isEmpty, isNil } from 'lodash';
import {
  MessageType,
  ResponseType,
  TextResponse,
  Comment,
} from 'lexica-dialog-model/dist/Message';
import {
  Status,
} from 'lexica-dialog-model/dist/Issue';
import {
  Config,
} from 'lexica-dialog-model/dist/Config';
import {
  senderInfoRepository,
  messageRepository,
  configRepository,
  issueRepository,
  MessageModel,
} from 'lexica-dialog-repository';
import { FacebookMessenger } from 'lexica-dialog-facebook-messenger/dist';
import { Response, MessagingType } from 'lexica-dialog-facebook-messenger/dist/Types';
import { senderInfoMiddleware } from './SenderInfoMiddleware';
import { newConversionMiddleware } from './NewConversionMiddleware';
import { uniConfigsMiddleware } from './UniConfigsMiddleware';
import { CONFIG_KEYS } from '../../Constants';

const router = new Router({
  prefix: '/:senderInfoId/messages',
});

const facebookMessenger = new FacebookMessenger('en-GB');
const toConfigMap = (configs: Config[]) => {
  return configs.reduce((map, config) => map.set(config.key, config), Map<string, Config>({}));
};
const transform = (message: MessageModel) => {
  let body;
  let sender;

  if (message.type === MessageType.REQUEST) {
    body = message.request;
    sender = 'USER';
  } else {
    body = message.response;
    if (isNil(message.sessionId)) {
      sender = 'ADMIN';
    } else {
      sender = 'CHATBOT';
    }
  }

  return {
    body: omitBy(omit((body as any).toObject(), '_id'), isEmpty),
    comment: message.comment,
    date: message.date,
    id: message.id,
    issueId: message.issueId,
    sender,
    type: message.type,
  };
};

router.get('/', senderInfoMiddleware(), async (ctx) => {
  const {
    state: {
      user: {
        uni,
      },
    senderInfo: {
        senderId,
      },
    pageable,
    },
  } = ctx;
  const messagePage = await messageRepository.findPage(
    pageable,
    {
      senderId,
      uni,
    },
  );
  ctx.body = {
    ...messagePage,
    elements: messagePage.elements.map(transform),
  };
});

router.post(
  '/',
  senderInfoMiddleware({ notFoundReturnEmptyPage: false }),
  uniConfigsMiddleware(),
  newConversionMiddleware(),
  async (ctx, next) => {
    const {
      state: {
      user: {
        uni,
      },
      senderInfo: {
        senderId,
      },
      issue,
      systemMessage,
      systemMessageDate,
      uniConfigs,
      },
      request: {
        body: {
          message,
        },
      },
    } = ctx;
    const response: TextResponse = {
      message: `${uniConfigs.get(CONFIG_KEYS.LIBRARIAN_INDICATOR).value}: ${message}`,
      type: ResponseType.TEXT,
    };
    const date = new Date();

    if (systemMessage) {
      const systemResponse = facebookMessenger.response(
        List<TextResponse>([systemMessage]), senderId,
      );
      await facebookMessenger.send(systemResponse, uniConfigs);
      await messageRepository.create({
        date: systemMessageDate,
        issueId: !isNil(issue) ? issue.id : undefined,
        messenger: facebookMessenger.name,
        rawResponse: response,
        response: systemMessage,
        senderId,
        type: MessageType.RESPONSE,
        uni,
      });
    }

    const facebookResponse = facebookMessenger.response(List<TextResponse>([response]), senderId)
      .map((r: Response) => {
        r.messaging_type = MessagingType.MESSAGE_TAG;
        r.tag = 'ISSUE_RESOLUTION';
        return r;
      })
      .toList();
    await facebookMessenger.send(facebookResponse, uniConfigs);
    await messageRepository.create({
      date,
      issueId: !isNil(issue) ? issue.id : undefined,
      messenger: facebookMessenger.name,
      rawResponse: response,
      response,
      senderId,
      type: MessageType.RESPONSE,
      uni,
    });
    if (!isNil(issue)) {
      issue.lastUpdatedDate = date;
      await issueRepository.save(issue);
    }
    ctx.body = 'ok';
  },
);

router.patch(
  '/:messageId',
  senderInfoMiddleware({ notFoundReturnEmptyPage: false }),
  async (ctx) => {
    const {
      state: {
        user: {
          uni,
        },
      },
      request: {
        body: {
          comment,
        },
      },
      params: {
        messageId,
      },
    } = ctx;
    const message = await messageRepository.findById(messageId);
    if (!isNil(message) && message.uni === uni) {
      message.comment = comment;
      ctx.body = transform(await messageRepository.save(message));
    } else {
      throw Boom.notFound();
    }
  },
);

export {
  transform,
  router,
};

export default router;
