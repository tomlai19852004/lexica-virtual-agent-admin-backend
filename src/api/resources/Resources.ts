import { ResponseType } from 'lexica-dialog-model/dist/Intent';
import { TicketType, TicketStatus, AddPayload } from 'lexica-dialog-model/dist/Ticket';
import * as Router from 'koa-router';
import * as Boom from 'boom';
import {
  filter, find, assign, isNil, defaultTo, result as _result, every, pick,

} from 'lodash';

import {
  intentRepository,
  IntentModel,
  ticketRepository,
  TicketModel,
} from 'lexica-dialog-repository';

const router = new Router();

const ticketRequiredKey = [
  'id',
  'payload.category',
  'payload.subCategory',
  'payload.responses',
  'payload.sampleQuestion',
];

async function intentParser(intents: IntentModel[], tickets: TicketModel[]) {
  return await Promise.all(intents.map(async (intent) => {
    const { _id: id, responses, category, subCategory: subCat, sampleQuestion } = intent;
    const ticket = find(tickets, { intentId: String(id) });
    const subCategory = defaultTo<string>(subCat, '').trim().toUpperCase();
    const textOnlyResponses = filter(responses, { type: ResponseType.TEXT });

    if (isNil(textOnlyResponses.length) || category.toUpperCase() === 'HIDDEN') {
      return;
    }

    const pendingAction = _result(ticket, 'payload.action', undefined);

    return {
      category: category.trim().toUpperCase(),
      id,
      pendingAction,
      responses,
      sampleQuestion,
      subCategory: subCategory.trim().toUpperCase(),
    };
  }));
}

router.get('/', async (ctx) => {
  const { uni } = ctx.state.user;
  const { pending } = ctx.request.query;
  const intentResult: { [key: string]: any } = {};
  const intents = await intentRepository.findByUni(uni);

  if (typeof pending !== 'undefined') {
    const pendingAction = await ticketRepository.findByUniAndStatus(uni, TicketStatus.PENDING);
    const pendingIntent = filter(pendingAction, { payload: { action: TicketType.ADD } });
    ctx.body = pendingIntent.map(
      (ticket) => {
        if (ticket.payload.action === TicketType.ADD) {
          const {
            id,
            payload: {
              category,
              subCategory,
              sampleQuestion,
              responses,
            },
          } = pick(ticket, ticketRequiredKey) as
            {
              id: any,
              payload: AddPayload,
            };

          return {
            id,
            payload: {
              category: category.trim().toUpperCase(),
              responses,
              sampleQuestion,
              subCategory: subCategory.trim().toUpperCase(),
            },
          };
        }
      });
  } else {
    const allPendingTicket = await ticketRepository.findByUniAndStatus(uni, TicketStatus.PENDING);
    ctx.body = await intentParser(intents, allPendingTicket);
  }
});

router.patch('/:resourceId', async (ctx) => {
  const { resourceId } = ctx.params;
  const { uni, id: userId } = ctx.state.user;
  const { responses: newResponses, sampleQuestion } = ctx.request.body;
  const oldResponses = await intentRepository.findById(resourceId);

  if (!isNil(oldResponses)) {
    const responses = oldResponses.responses.map((response: any) => {
      const newResponse = defaultTo(find(newResponses, { _id: response.id }), response);
      return assign(response, newResponse);
    });
    const sq = defaultTo(sampleQuestion, oldResponses.sampleQuestion);
    await ticketRepository.save({
      date: new Date,
      intentId: resourceId,
      origin: oldResponses,
      payload: {
        action: TicketType.UPDATE,
        responses,
        sampleQuestion:sq,
      },
      status: TicketStatus.COMPLETED,
      uni,
      userId,
    });
    oldResponses.sampleQuestion = sq;
    oldResponses.responses = responses;
    const allPendingTicket = await ticketRepository.findByUniAndStatus(uni, TicketStatus.PENDING);
    ctx.body = await intentParser([(await intentRepository.save(oldResponses))], allPendingTicket);
  } else {
    throw Boom.badData();
  }
});

router.delete('/:resourceId', async (ctx) => {
  const { resourceId: intentId } = ctx.params;
  const { uni, id: userId } = ctx.state.user;

  const ticket = await ticketRepository.findByUniAndStatusAndIntentId(
    uni,
    TicketStatus.PENDING,
    intentId,
  );

  if (isNil(ticket)) {
    const intent = await intentRepository.findById(intentId);
    if (!isNil(intent)) {
      const date = new Date();
      await ticketRepository.save({
        date,
        intentId,
        origin: intent,
        payload: {
          action: TicketType.DELETE,
          delete: false
        },
        status: TicketStatus.PENDING,
        uni,
        userId,
      });
      ctx.body = [intent.category, intent.subCategory, intentId].join('.');
    } else {
      throw Boom.badData();
    }
  } else {
    ctx.body = 'already pending for deletion';
  }
});

router.put('/', async (ctx) => {
  const { uni, id: userId } = ctx.state.user;
  const { category, subCategory, sampleQuestion, response } = ctx.request.body;

  if (!every([category, subCategory, sampleQuestion, response], value => value)) {
    throw Boom.badData();
  } else {
    const date = new Date();
    const ticket = await ticketRepository.save({
      date,
      payload: {
        action: TicketType.ADD,
        category,
        responses: [{
          messages: [
            {
              'en-GB': response,
            },
          ],
          type: ResponseType.TEXT,
        }],
        sampleQuestion,
        subCategory,
      },
      status: TicketStatus.PENDING,
      uni,
      userId,
    });
    ctx.body = pick(ticket, ticketRequiredKey);
  }
});

export default router;
