import * as Boom from 'boom';
import { Middleware, Context } from 'koa';
import { ObjectSchema, validate } from 'joi';
import * as winston from 'winston';
import { isNil, defaultTo } from 'lodash';

const createBoomFromError = (error: any) => {
  let result;
  if (error.isBoom) {
    result = error;
  } else if (error.name === 'UnauthorizedError') {
    result = Boom.unauthorized(error.message, error);
  } else {
    result = Boom.internal(error.message, error);
  }
  return result;
};

const responseWrapperMiddleware = () => {
  const middleware: Middleware = async (ctx, next) => {
    try {
      await next();
      if (!isNil(ctx.body)) {
        ctx.status = defaultTo<number>(ctx.status, 200);
        ctx.body = {
          payload: ctx.body,
          statusCode: ctx.status,
        };
      } else {
        throw Boom.notAcceptable();
      }
    } catch (error) {
      const boom = createBoomFromError(error);
      const { output: { payload, statusCode }, data } = boom;
      ctx.status = statusCode;
      ctx.body = {
        ...payload,
        payload: data,
      };
      if (statusCode === 500) {
        winston.error(error);
      }
    }
  };
  return middleware;
};

export {
  responseWrapperMiddleware,
};
