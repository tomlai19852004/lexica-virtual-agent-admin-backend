import * as Router from 'koa-router';
import { default as suspendAutoReply } from './AutoReply';

const router = new Router({
  prefix: '/controls',
});

router.use(suspendAutoReply.routes());

export default router;
