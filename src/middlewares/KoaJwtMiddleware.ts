import * as koaJwt from 'koa-jwt';
import { ENV_CONFIGS } from '../Constants';

const { JWT_KEY } = ENV_CONFIGS;

const createKaoJwtMiddleware = (options?: any) => koaJwt({
  secret: JWT_KEY as string,
  ...options,
});

export {
  createKaoJwtMiddleware,
};
