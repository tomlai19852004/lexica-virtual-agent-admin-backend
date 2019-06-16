import * as Router from 'koa-router';
import * as Joi from 'joi';
import * as moment from 'moment';
import { messageRepository } from 'lexica-dialog-repository';
import { createValidationMiddleware } from '../../middlewares/ValidationMiddleware';

enum Type {
  TOTAL = 'TOTAL',
  CATEGORIES = 'CATEGORIES',
  CHANNELS = 'CHANNELS',
}

enum Group {
  HOUR = 'HOUR',
  DAY = 'DAY',
  WEEK = 'WEEK',
  MONTH = 'MONTH',
}

const schema = Joi.object().keys({
  end: Joi.string().isoDate().required(),
  group: Joi.string().allow(
    Group.HOUR,
    Group.DAY,
    Group.WEEK,
    Group.MONTH,
  ).only().default(Group.DAY),
  start: Joi.string().isoDate().required(),
  type: Joi.string().allow(
    Type.TOTAL,
    Type.CATEGORIES,
    Type.CHANNELS,
  ).only().default(Type.TOTAL),
});

const validationMiddleware = createValidationMiddleware(schema, context => context.query);
const router = new Router();

function projectAggregation(group: Group) {

  const project = {
    $project: {
      dayOfMonth: {
        $dayOfMonth: {
          date: '$date',
          timezone:'Asia/Hong_Kong',
        },
      },
      hour: {
        $hour: {
          date: '$date',
          timezone:'Asia/Hong_Kong',
        },
      },
      month: {
        $month: {
          date: '$date',
          timezone:'Asia/Hong_Kong',
        },
      },
      week: {
        $week: {
          date: '$date',
          timezone:'Asia/Hong_Kong',
        },
      },
      year: {
        $year: {
          date: '$date',
          timezone:'Asia/Hong_Kong',
        },
      },
    },
  };

  if (group === Group.MONTH) {
    delete project.$project.week;
    delete project.$project.dayOfMonth;
    delete project.$project.hour;
  } else if (group === Group.WEEK) {
    delete project.$project.dayOfMonth;
    delete project.$project.hour;
  } else if (group === Group.DAY) {
    delete project.$project.week;
    delete project.$project.hour;
  } else if (group === Group.HOUR) {
    delete project.$project.week;
  }

  return project;

}

function groupAggregation() {
  return {
    $group: {
      _id: {
        category: '$category',
        channel: '$channel',
        dayOfMonth: '$dayOfMonth',
        hour: '$hour',
        month: '$month',
        week: '$week',
        year: '$year',
      },
      count: {
        $sum: 1,
      },
    },
  };
}

function sortAggregation() {
  return {
    $sort: {
      '_id.category': 1,
      '_id.channel': 1,
      '_id.dayOfMonth': 1,
      '_id.hour': 1,
      '_id.month': 1,
      '_id.week': 1,
      '_id.year': 1,
    },
  };
}

router.get('/traffic', validationMiddleware, async (context) => {
  const { body } = context.request;
  const { uni } = context.state.user;
  const aggregations: object[] = [];

  aggregations.push({
    $match: {
      date: {
        $gte: moment.utc(body.start).startOf('day').toDate(),
        $lte: moment.utc(body.end).endOf('day').toDate(),
      },
      uni,
    },
  });

  if (body.type === Type.TOTAL) {
    const project = projectAggregation(body.group);
    aggregations.push(project, groupAggregation());
  } else if (body.type === Type.CATEGORIES) {
    const group = groupAggregation();
    aggregations.push(
      {
        $unwind: '$commands',
      },
      {
        $lookup: {
          as: 'intent',
          foreignField: 'command',
          from: 'Intents',
          localField: 'commands',
        },
      },
      {
        $unwind: '$intent',
      },
      {
        $redact: {
          $cond: {
            else: '$$PRUNE',
            if: {
              $and: [
                {
                  $eq: ['$uni', '$intent.uni'],
                },
              ],
            },
            then: '$$KEEP',
          },
        },
      },
      {
        $project: {
          ...projectAggregation(body.group).$project,
          category: '$intent.category',
        },
      },
      {
        $match: {
          category: {
            $not: /^hidden/ig,
          },
        },
      },
      {
        $group: {
          _id:{
            ...group.$group._id,
            mid: '$_id',
          },
          count: {
            ...group.$group.count,
          },
        },
      },
      {
        $project: {
          category: '$_id.category',
          dayOfMonth: '$_id.dayOfMonth',
          hour: '$_id.hour',
          month: '$_id.month',
          week: '$_id.week',
          year: '$_id.year',
        },
      },
      group,
    );
  } else if (body.type === Type.CHANNELS) {
    const project = {
      $project: {
        ...projectAggregation(body.group).$project,
        channel: '$messenger',
      },
    };
    aggregations.push(project, groupAggregation());
  }

  aggregations.push(sortAggregation());

  context.body = await messageRepository.aggregate(aggregations);
});

export default router;
