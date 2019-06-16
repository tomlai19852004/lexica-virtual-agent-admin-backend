import { Middleware, Context } from 'koa';
import * as Boom from 'boom';
import { isNil } from 'lodash';
import * as koaJwt from 'koa-jwt';
import { createKaoJwtMiddleware } from './KoaJwtMiddleware';
import * as compose from 'koa-compose';

const tokenMiddleware = () => {
  const middleware: Middleware = async (ctx, next) => {
    const token = ctx.query.token;
    ctx.request.headers.authorization = 'bearer ' + token;
    await next();
  };
  return middleware;
};

const composedMiddleware = compose([tokenMiddleware(),createKaoJwtMiddleware()]);

export {
    composedMiddleware,
    tokenMiddleware,
};
