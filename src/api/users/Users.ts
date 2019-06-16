import * as Boom from 'boom';
import * as Router from 'koa-router';
import { isNil } from 'lodash';
import { userRepository, UserModel } from 'lexica-dialog-repository';
import { hashPassword } from './Shared';

const router = new Router();

router.post('/', async (ctx) => {
  const { username, password, uni } = ctx.request.body;
  const hashedPassword = await hashPassword(password);
  const user = await userRepository.findByUsernameAndUni(username, uni);
  if (!isNil(user)) {
    throw Boom.badRequest('user already exist');
  } else {
    const save = await userRepository.create({
      password: hashedPassword,
      uni,
      username,
    });
    ctx.body = { message: 'ok' };
  }
});

export default router;
