import * as Boom from 'boom';
import { Middleware, Context } from 'koa';
import { ObjectSchema, validate } from 'joi';
import { isNil } from 'lodash';

type ObjectProvider = (context: Context) => any;

const defaultObjectProvider: ObjectProvider = (context: Context) => context.request.body;

const createValidationMiddleware
  = (schema: ObjectSchema, objectProvider: ObjectProvider = defaultObjectProvider) => {
    const middleware: Middleware = async (context: Context, next) => {
      const result = validate(objectProvider(context), schema);
      if (!isNil(result.error)) {
        const { error: { name, details } } = result;
        throw Boom.badRequest(name, details);
      } else {
        context.request.body = result.value;
        await next();
      }
    };
    return middleware;
  };

export { createValidationMiddleware };
