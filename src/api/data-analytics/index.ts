import * as Router from 'koa-router';
import { default as traffic } from './Traffic';
import { default as messageComments } from './MessageComments';

const router = new Router({
  prefix: '/data-analytics',
});

router.use(traffic.routes());
router.use(messageComments.routes());

export default router;
