import * as Router from 'koa-router';
import { default as resources } from './Resources';

const router = new Router({
  prefix: '/resources',
});

router.use(resources.routes());

export default router;
