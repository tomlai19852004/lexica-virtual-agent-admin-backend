import * as Router from 'koa-router';
import { default as token } from './Token';
import { default as types } from './Types';
import { default as validate } from './Validate';
import { default as users } from './Users';

const router = new Router({
  prefix: '/users',
});

router.use(token.routes());
router.use(types.routes());
router.use(validate.routes());
router.use(users.routes());

export default router;
