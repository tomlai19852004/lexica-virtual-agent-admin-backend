import * as Router from 'koa-router';
import * as Boom from 'boom';
import { Map } from 'immutable';
import { omit, escapeRegExp, isNil } from 'lodash';
import { Types } from 'mongoose';
import {
  Status,
} from 'lexica-dialog-model/dist/Issue';
import {
  issueRepository,
  senderInfoRepository,
  SortDirection,
} from 'lexica-dialog-repository';
import { ConversationActivity } from './models/ConversationActivity';
import { conversationActivityRepository } from './repositories/ConversationActivityRepository';

const router = new Router();

interface AggregateArgument {
  uni: string,
  status?: Status,
  query?: string,
};

const aggregateComposer = ({ uni, status, query }: AggregateArgument) => {
  const aggregate = [];
  aggregate.push({
    $match: {
      uni,
    },
  });
  if (!isNil(query)) {
    if (Types.ObjectId.isValid(query)) {
      aggregate.push({
        $match: {
          _id: new Types.ObjectId(query),
        },
      });
    } else {
      const str = query.toLowerCase().split(' ').map(escapeRegExp).join('|');
      const regexp = new RegExp(str, 'ig');
      aggregate.push({
        $match: {
          $or: [
            {
              firstName: {
                $regex: regexp,
              },
            },
            {
              lastName: {
                $regex: regexp,
              },
            },
          ],
        },
      });
    }
  }
  aggregate.push(
    {
      $lookup: {
        as: 'message',
        foreignField: 'senderId',
        from: 'Messages',
        localField: 'senderId',
      },
    },
  );
  if (!isNil(status)) {
    aggregate.push(
      {
        $lookup: {
          as: 'issue',
          foreignField: 'senderId',
          from: 'Issues',
          localField: 'senderId',
        },
      },
    );
  }
  aggregate.push(
    {
      $unwind: '$message',
    },
  );
  if (!isNil(status)) {
    aggregate.push(
      {
        $unwind: '$issue',
      },
    );
  }
  aggregate.push(
    {
      $redact: {
        $cond: {
          else: '$$PRUNE',
          if: {
            $and: [
              {
                $eq: ['$uni', '$message.uni'],
              },
              {
                $eq: ['$messenger', '$message.messenger'],
              },
            ],
          },
          then: '$$KEEP',
        },
      },
    },
  );
  if (!isNil(status)) {
    aggregate.push(
      {
        $redact: {
          $cond: {
            else: '$$PRUNE',
            if: {
              $and: [
                {
                  $eq: ['$uni', '$issue.uni'],
                },
                {
                  $eq: ['$messenger', '$issue.messenger'],
                },
              ],
            },
            then: '$$KEEP',
          },
        },
      },
    );
  }
  aggregate.push(
    {
      $group: {
        _id: {
          firstName: '$firstName',
          id: '$_id',
          lastName: '$lastName',
          messenger: '$messenger',
          middleName: '$middleName',
        },
        lastUpdatedDate: {
          $last: '$message.date',
        },
        statusSet: {
          $addToSet: '$issue.status',
        },
      },
    },
    {
      $project: {
        firstName: '$_id.firstName',
        id: '$_id.id',
        lastName: '$_id.lastName',
        lastUpdatedDate: '$lastUpdatedDate',
        messenger: '$_id.messenger',
        middleName: '$_id.middleName',
        status: {
          $switch: {
            branches: [
              {
                case: {
                  $setIsSubset: [['OPEN'], '$statusSet'],
                },
                then: 'OPEN',
              },
              {
                case: {
                  $setIsSubset: [['CLOSED'], '$statusSet'],
                },
                then: 'CLOSED',
              },
            ],
            default: 'UNKNOWN',
          },
        },
      },
    },
  );
  if (!isNil(status)) {
    aggregate.push(
      {
        $match: {
          status,
        },
      },
    );
  }
  return aggregate;
};

router.get('/', async (ctx) => {
  const { state: { user: { id: userId, uni }, pageable } } = ctx;
  const { status, query } = ctx.query as AggregateArgument;
  const conversationPage =
    await senderInfoRepository.aggregatePage(pageable, aggregateComposer({
      query,
      status,
      uni,
    }));

  // TODO: Fix it when MongoDB allow type conversion in aggregate.
  let activityMap = Map<string, ConversationActivity>();
  if (conversationPage.elements.length > 0) {
    const query = {
      $or: conversationPage.elements.map(conversation => ({
        senderInfoId: conversation.id,
        userId,
      })),
    };
    activityMap = (await conversationActivityRepository
      .find(query))
      .reduce(
      (map, activity) => map.set(activity.senderInfoId, activity),
      Map<string, ConversationActivity>({}),
    );
  }
  ctx.body = {
    ...conversationPage,
    elements: conversationPage.elements.map((conversation) => {
      const activity = activityMap.get(conversation.id.toString());
      return omit(
        {
          ...conversation,
          seen: !isNil(activity) ? activity.seen : undefined,
        },
        '_id',
      );
    }),
  };
});

export default router;
