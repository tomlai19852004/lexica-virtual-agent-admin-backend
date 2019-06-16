import { Middleware, Context } from 'koa';
import * as Boom from 'boom';
import { isNil } from 'lodash';
import { SenderInfo } from 'lexica-dialog-model/dist/SenderInfo';
import { senderInfoRepository, PageResult } from 'lexica-dialog-repository';

const senderInfoMiddleware = ({ notFoundReturnEmptyPage = true } = {}) => {
  const middleware: Middleware = async (ctx, next) => {
    const { senderInfoId } = ctx.params;
    const { uni } = ctx.state.user;
    const senderInfo = await senderInfoRepository.findById(senderInfoId);
    if (isNil(senderInfo) || (!isNil(senderInfo) && senderInfo.uni !== uni)) {
      if (notFoundReturnEmptyPage) {
        const { pageable } = ctx.state;
        ctx.body = new PageResult([], 0, pageable);
      } else {
        throw Boom.badRequest();
      }
    } else {
      ctx.state.senderInfo = senderInfo;
      await next();
    }
  };
  return middleware;
};

export {
  senderInfoMiddleware,
};
