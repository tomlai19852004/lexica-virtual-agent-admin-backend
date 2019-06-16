import * as Router from 'koa-router';
import * as Boom from 'boom';
import * as Joi from 'joi';
import * as jwt from 'jsonwebtoken';
import { isNil } from 'lodash';
import { ENV_CONFIGS } from '../../Constants';
import { userRepository, configRepository } from 'lexica-dialog-repository';
import { createValidationMiddleware } from '../../middlewares/ValidationMiddleware';
import { isPasswordMatch } from './Shared';

const jwtExpireSecond = parseInt(ENV_CONFIGS.JWT_EXPIRE_SECOND, 10);
const router = new Router();
const schema = Joi.object().keys({
  password: Joi.string().min(3).max(30).required(),
  uni: Joi.string().alphanum().min(3).max(30).required(),
  username: Joi.string().alphanum().min(3).max(30).required(),
});

const validationMiddleware = createValidationMiddleware(schema);

router.post('/token', validationMiddleware, async (context) => {
  const body = context.request.body;
  const user = await userRepository.findByUsernameAndUni(body.username, body.uni);

  if (!isNil(user)) {
    if (await isPasswordMatch(body.password, user.password)) {
      const tokenBody = {
        id: user._id,
        uni: user.uni,
        username: user.username,
      };
      const token = jwt.sign(tokenBody, ENV_CONFIGS.JWT_KEY, {
        expiresIn: jwtExpireSecond,
      });
      context.body = { token };
    } else {
      throw Boom.badData('username or password is not correct');
    }
  } else {
    throw Boom.badData('user not found');
  }
});

export default router;
