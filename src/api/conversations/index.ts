import * as Router from 'koa-router';
import { default as conversations } from './Conversations';
import { default as issues } from './Issues';
import { default as messages } from './Messages';
import { default as activities } from './Activities';
import { default as suggestions } from './Suggestions';
import { default as downloader } from './FileDownloader';
import { default as requestResponseMapping } from './RequestResponseMapping';
import { default as emailForward } from './EmailForward';

const router = new Router({
  prefix: '/conversations',
});

router.use(activities.routes());
router.use(messages.routes());
router.use(issues.routes());
// child routes should be declared before parent?
router.use(downloader.routes());
router.use(requestResponseMapping.routes());
router.use(emailForward.routes());
router.use(conversations.routes());
router.use(suggestions.routes());

export default router;
