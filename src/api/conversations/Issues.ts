import * as Router from 'koa-router';
import * as Boom from 'boom';
import {
  Status,
} from 'lexica-dialog-model/dist/Issue';
import {
  issueRepository,
} from 'lexica-dialog-repository';
import { senderInfoMiddleware } from './SenderInfoMiddleware';

const router = new Router({
  prefix: '/:senderInfoId/issues',
});

router.post('/close', senderInfoMiddleware({ notFoundReturnEmptyPage: false }), async (ctx) => {
  const {
    state: {
      user: {
        uni,
      },
    senderInfo: {
        senderId,
      },
    pageable,
    },
  } = ctx;
  const issues = await issueRepository.findByUniAndSenderIdAndStatus(uni, senderId, Status.OPEN);
  if (issues.length > 0) {
    await Promise.all(issues.map(async (issue) => {
      issue.closedDate = new Date();
      issue.status = Status.CLOSED;
      issueRepository.save(issue);
    }));
    ctx.body = 'ok';
  } else {
    throw Boom.badRequest('issue not found');
  }
});

export default router;
