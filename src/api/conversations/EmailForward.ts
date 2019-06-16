import * as Router from 'koa-router';
import * as AWS from 'aws-sdk';
import * as Joi from 'joi';
import { ENV_CONFIGS } from '../../Constants';
import { createValidationMiddleware } from '../../middlewares/ValidationMiddleware';

const schema = Joi.object().keys({
  bcc: Joi.array().items(Joi.string().email().required()),
  body: Joi.string().required(),
  cc: Joi.array().items(Joi.string().email().required()),
  subject: Joi.string().required(),
  to: Joi.array().items(Joi.string().email().required()).required(),
});

const router = new Router({
  prefix: '/email',
});

const ses: AWS.SES = new AWS.SES({
  apiVersion: ENV_CONFIGS.AWS_CHATBOT_SES_API_VERSION,
  region: ENV_CONFIGS.AWS_CHATBOT_SES_REGION,
});

router.post(
  '/',
  createValidationMiddleware(schema),
  async (ctx) => {
    const {
      request: {
        body: {
          to,
          cc,
          bcc,
          subject,
          body,
        },
      },
    } = ctx;
    const params = {
      Destination: {
        BccAddresses: bcc,
        CcAddresses: cc,
        ToAddresses: to,
      },
      Message: {
        Body: {
          Html: {
            Charset: 'UTF-8',
            Data: body,
          },
        },
        Subject: {
          Charset: 'UTF-8',
          Data: subject,
        },
      },
      Source: ENV_CONFIGS.AWS_CHATBOT_SES_SENDER,
    };
    await ses.sendEmail(params).promise();
    ctx.body = 'ok';
  },
);

export default router;
