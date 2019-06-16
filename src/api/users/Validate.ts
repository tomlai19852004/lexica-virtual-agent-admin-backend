import * as Router from 'koa-router';
import { createKaoJwtMiddleware } from '../../middlewares/KoaJwtMiddleware';

const router = new Router();

router.get('/validate', createKaoJwtMiddleware({ passthrough: true }), async (ctx) => {
  if (ctx.state.user) {
    ctx.body = { result: true };
  } else {
    ctx.body = { result: false };
  }
});

export default router;
