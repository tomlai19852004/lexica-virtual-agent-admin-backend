import * as Router from 'koa-router';
import { senderInfoMiddleware } from './SenderInfoMiddleware';
import { messageMiddleware } from './MessageMiddleware';
import { tokenMiddleware, composedMiddleware } from '../../middlewares/TokenMiddleware';
import { createKaoJwtMiddleware } from '../../middlewares/KoaJwtMiddleware';
import * as compose from 'koa-compose';
import { ENV_CONFIGS } from '../../Constants';
import * as AWS from 'aws-sdk';
import * as fs from 'fs';
import * as Boom from 'boom';
import { resolve } from 'url';

interface FileLocationParams {
  Bucket: string,
  Key: string,
};

const s3: AWS.S3 = new AWS.S3({
  apiVersion: ENV_CONFIGS.AWS_CHATBOT_S3_API_VERSION,
});

const router = new Router({
  prefix: '/:senderInfoId/messages/:messageId/file',
});

router.get(
  '/',
  composedMiddleware,
  senderInfoMiddleware(),
  messageMiddleware(),
  async (ctx) => {
    const {
      state: {
        user: {
          uni,
        },
        senderInfo: {
          senderId,
        },
        pageable,
        message,
      },
    } = ctx;
    const messageType: string = message.request.type;
    const contentType: string = message.request.contentType;
    if (messageType === 'TEXT') {
      throw Boom.badRequest();
    } else {
      const bucketKey = message.request.path;
      const s3FilePath: FileLocationParams = {
        Bucket: ENV_CONFIGS.AWS_CHATBOT_S3_BUCKET,
        Key: bucketKey,
      };
      await new Promise((resolve, reject) => {
        ctx.status = 200;
        ctx.type = contentType;
        s3.getObject(s3FilePath)
          .createReadStream()
          .on('error', (err: any) => {
            ctx.status = 500;
            reject(err);
          })
          .pipe(ctx.response.res)
          .on('end', () => {
            resolve();
          });
      });
    }
  });

export default router;

