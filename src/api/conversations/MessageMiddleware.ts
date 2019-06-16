import { Middleware, Context } from 'koa';
import * as Boom from 'boom';
import { isNil } from 'lodash';
import {
    MessageType,
  } from 'lexica-dialog-model/dist/Message';
import {
    messageRepository,
} from 'lexica-dialog-repository';

const messageMiddleware = () => {
  const middleware: Middleware = async (ctx, next) => {
    const { messageId } = ctx.params;
    const { uni } = ctx.state.user;
    const messageInfo = await messageRepository.findById(messageId);
    if (isNil(messageInfo) || messageInfo.uni !== uni) {
      throw Boom.badRequest();
    } else {
      ctx.state.message = messageInfo;
      await next();
    }
  };
  return middleware;
};

export {
    messageMiddleware,
};
