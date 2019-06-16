import { Context } from 'koa';
import * as Router from 'koa-router';
import * as Joi from 'joi';
import { isNil, keyBy, has, omit, Dictionary } from 'lodash';
import * as Boom from 'boom';
import {
  Message,
  MessageType,
} from 'lexica-dialog-model/dist/Message';
import {
  requestResponseMappingRepository,
  messageRepository,
  MessageModel,
  RequestResponseMappingModel,
} from 'lexica-dialog-repository';
import {
  createValidationMiddleware,
} from '../../middlewares/ValidationMiddleware';
import {
  transform as messageTransform,
} from './Messages';

const router = new Router({
  prefix: '/request-response-mappings',
});

const schema = Joi.object().keys({
  requests: Joi.array().min(1).required(),
  responses: Joi.array().min(1).required(),
});

const validationMiddleware = createValidationMiddleware(schema);

const validateExists = (messages: Dictionary<MessageModel>, ids: string[], type: MessageType) => {
  ids.forEach((id: string) => {
    if (!has(messages, id) || (!isNil(messages['id']) && messages['id'].type !== type)) {
      throw Boom.badData(`${type} not found. ID: ${id}`);
    }
  });
};

const transform = (element: RequestResponseMappingModel) => {
  return {
    id: element.id,
    requests: element.requests,
    responses: element.responses,
  };
};

const fetchMessageIds = (element: RequestResponseMappingModel) => {
  return element.requests.concat(element.responses);
};

const fetchMessages =
  async (model: RequestResponseMappingModel | RequestResponseMappingModel[]) => {
    let arrayModel = false;
    let elements: RequestResponseMappingModel[] = [];

    if (Array.isArray(model)) {
      elements = model;
      arrayModel = true;
    } else {
      elements = [model];
    }

    const messageIds = elements
      .map(fetchMessageIds)
      .reduce((a, b) => a.concat(b), []);
    const messages = keyBy(await messageRepository.findByIds(messageIds), m => m.id) as Dictionary<MessageModel>;
    const messageMapping = (id: string) => messageTransform(messages[id]);
    const results = elements
      .map(e => ({
        ...transform(e),
        requestMessages : e.requests.map(messageMapping),
        responsesMessages : e.responses.map(messageMapping),
      }));
    if (arrayModel) {
      return results;
    }

    return results[0];
  };

const findById = async (ctx: Context) => {
  const {
    state: {
      user: {
        uni,
      },
    },
    params: {
      mappingId,
    },
  } = ctx;
  const mapping = await requestResponseMappingRepository.findById(mappingId);
  if (!isNil(mapping) && mapping.uni === uni) {
    return mapping;
  }
  throw Boom.notFound();
};

router.get('/', async (ctx) => {
  const {
    state: {
      user: {
        uni,
      },
      pageable,
    },
  } = ctx;
  ctx.body = await requestResponseMappingRepository
    .findPage(pageable, { uni });
  ctx.body.elements = await fetchMessages(ctx.body.elements);
});

router.get('/:mappingId', async (ctx) => {
  const mapping = await findById(ctx);
  ctx.body = await fetchMessages(mapping);
});

router.post('/', validationMiddleware, async (ctx) => {
  const {
    state: {
      user: {
        id,
        uni,
      },
    },
    request: {
      body,
    },
  } = ctx;
  const requestIds = body.requests;
  const responseIds = body.responses;
  const ids = requestIds.concat(responseIds);
  const messages = keyBy(await messageRepository.findByIds(ids), m => m.id) as Dictionary<MessageModel>;

  validateExists(messages, requestIds, MessageType.REQUEST);
  validateExists(messages, responseIds, MessageType.RESPONSE);

  ctx.body = await requestResponseMappingRepository.create({
    createdBy: id,
    requests: requestIds,
    responses: responseIds,
    uni,
    updatedBy: id,
  });
  ctx.body = (await fetchMessages(ctx.body));
});

router.delete('/:mappingId', async (ctx) => {
  const mapping = await findById(ctx);
  await requestResponseMappingRepository.remove(mapping);
  ctx.body = true;
});

export default router;
