import * as Router from 'koa-router';
import * as Joi from 'joi';
import * as moment from 'moment';
import { messageRepository } from 'lexica-dialog-repository';
import { createValidationMiddleware } from '../../middlewares/ValidationMiddleware';

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

router.get('/message-comments', validationMiddleware, async (context) => {
  const { body } = context.request;
  const { uni } = context.state.user;
  const aggregations = [
    {
      $match: {
        date: {
          $gte: moment.utc(body.start).startOf('day').toDate(),
          $lte: moment.utc(body.end).endOf('day').toDate(),
        },
        uni,
      },
    },
    {
      $project: {
        ...projectAggregation(body.group).$project,
        newType: '$comment.newType',
        rating: '$comment.rating',
      },
    },
    {
      $match: {
        $or: [
          {
            rating: {
              $exists: true,
            },
          },
          {
            newType: {
              $exists: true,
            },
          },
        ],
      },
    },
    {
      $group: {
        _id: {
          dayOfMonth: '$dayOfMonth',
          hour: '$hour',
          month: '$month',
          newType: '$newType',
          rating: '$rating',
          week: '$week',
          year: '$year',
        },
        count: {
          $sum: 1,
        },
      },
    },
    {
      $sort: {
        '_id.dayOfMonth': 1,
        '_id.hour': 1,
        '_id.month': 1,
        '_id.newType': 1,
        '_id.rating': 1,
        '_id.week': 1,
        '_id.year': 1,
      },
    },
  ];
  context.body = await messageRepository.aggregate(aggregations);
});

export default router;
