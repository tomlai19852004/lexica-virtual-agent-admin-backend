import * as Router from 'koa-router';
import { isNil } from 'lodash';
import { conversationActivityRepository } from './repositories/ConversationActivityRepository';
import { senderInfoMiddleware } from './SenderInfoMiddleware';

const router = new Router({
  prefix: '/:senderInfoId',
});

router.post('/seen', senderInfoMiddleware({ notFoundReturnEmptyPage: false }), async (ctx) => {
  const {
    state: {
      user: {
        uni,
        id: userId,
      },
      senderInfo: {
        id: senderInfoId,
        senderId,
      },
    },
  } = ctx;
  const date = new Date();
  const activity =
    await conversationActivityRepository
      .findOneByUserIdAndSenderInfoId(userId, senderInfoId);
  if (!isNil(activity)) {
    activity.seen = date;
    await conversationActivityRepository.save(activity);
  } else {
    await conversationActivityRepository.create({
      seen: date,
      senderInfoId,
      suggestedAnswerClick: 0,
      userId,
    });
  }
  ctx.body = 'ok';
});

router.post(
  '/suggested-answer-click',
  senderInfoMiddleware({ notFoundReturnEmptyPage: false }),
  async (ctx) => {
    const {
      state: {
        user: {
          uni,
          id: userId,
        },
        senderInfo: {
          id: senderInfoId,
          senderId,
        },
      },
    } = ctx;
    const date = new Date();
    const activity =
      await conversationActivityRepository
        .findOneByUserIdAndSenderInfoId(userId, senderInfoId);
    if (!isNil(activity)) {
      if (isNil(activity.suggestedAnswerClick)) {
        activity.suggestedAnswerClick = 1;
      } else {
        activity.suggestedAnswerClick = activity.suggestedAnswerClick + 1;
      }
      await conversationActivityRepository.save(activity);
    } else {
      await conversationActivityRepository.create({
        seen: date,
        senderInfoId,
        suggestedAnswerClick: 1,
        userId,
      });
    }
    ctx.body = 'ok';
  });

export default router;
