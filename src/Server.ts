import { Server } from 'http';
import * as Koa from 'koa';
import * as BodyParser from 'koa-bodyparser';
import * as koaJwt from 'koa-jwt';
import * as cors from 'kcors';
import * as Router from 'koa-router';
import * as winston from 'winston';
import * as mongoose from 'mongoose';
import * as AWS from 'aws-sdk';
import { isNil } from 'lodash';
import { ENV_CONFIGS } from './Constants';
import * as api from './api';
import {
  responseWrapperMiddleware,
  pageableMiddleware,
  createKaoJwtMiddleware,
} from './middlewares';

const koaQs = require('koa-qs');

const { PORT, MONGO_URL, JWT_KEY } = ENV_CONFIGS;
let koa: Koa | undefined;
let server: Server | undefined;
let connection: mongoose.Connection | undefined;

const start = async () => {
  const root = new Router({
    prefix: '/api',
  });

  koa = new Koa();
  koaQs(koa, 'first');
  koa.use(BodyParser());
  koa.use(cors());
  koa.use(responseWrapperMiddleware());

  koa.use(createKaoJwtMiddleware().unless({
    path: [
      /^\/api\/users\/token$/,
      /^\/api\/users\/types$/,
      /^\/api\/users\/validate$/,
      /^\/api\/conversations\/[\w]+\/messages\/[\w]+\/file/,
    ],
  }));


  koa.use(pageableMiddleware({
    defaultSize: 50,
    maxSize: 5000,
  }));

  Object
    .values(api)
    .forEach(router => root.use(router.routes(), router.allowedMethods()));

  koa.use(root.routes());

  AWS.config.update({
    accessKeyId: ENV_CONFIGS.AWS_ACCESS_KEY_ID,
    region: ENV_CONFIGS.AWS_REGION,
    secretAccessKey: ENV_CONFIGS.AWS_SECRET_ACCESS_KEY,
  });
  AWS.config.setPromisesDependency(Promise);

  await mongoose.connect(MONGO_URL as string);
  (mongoose as any).Promise = global.Promise;
  connection = mongoose.connection;

  server = koa.listen(PORT);
  winston.info(`Server is listening on PORT: ${PORT}`);
};

const stop = async () => {
  if (!isNil(connection)) {
    await mongoose.disconnect();
    connection = undefined;
  }

  await new Promise((resolve) => {
    if (!isNil(server)) {
      server.close(resolve);
      server = undefined;
      koa = undefined;
    } else {
      resolve();
    }
  });
};

export { start, stop };
