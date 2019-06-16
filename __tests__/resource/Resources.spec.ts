import { pick, pull, sample, filter, reject } from 'lodash';
import { Types } from 'mongoose';

import { before, after, api } from '../Shared';

const endpoint = '/resources';

before();
after();

describe('Resources Editor: Resource API', async () => {
  it('should get all intents for user testdev', async () => {
    const res = await api.execute(endpoint);

    expect(res).toBeDefined();
    expect(res.payload).toBeInstanceOf(Array);
    res.payload.forEach((element) => {
      expect(element).toHaveProperty('id');
      expect(element).toHaveProperty('category');
      expect(element).toHaveProperty('subCategory');
      expect(element).toHaveProperty('sampleQuestion');
      expect(element).toHaveProperty('responses');
      expect(element.responses).toBeInstanceOf(Array);
      if (element.hasOwnProperty('pendingAction')) {
        expect(element.responses).toEqual('DELETE');
      }
    });
  });

  it('should get all pending intents for user testdev', async () => {
    const res = await api.execute(endpoint, {
      qs: {
        pending: '',
      },
    });

    expect(res).toBeDefined();
    expect(res.payload).toBeInstanceOf(Array);
    res.payload.forEach((element) => {
      expect(element).toHaveProperty('id');
      expect(element).toHaveProperty('payload.category');
      expect(element).toHaveProperty('payload.subCategory');
      expect(element).toHaveProperty('payload.responses');
      expect(element).toHaveProperty('payload.sampleQuestion');
    });
  });

  it('should create new intent ticket for approval', async () => {
    const res = await api.execute(endpoint, {
      method: 'PUT',
      body: {
        category: 'BORROW',
        subCategory: 'COLLECTION',
        sampleQuestion: `this is a unit test result at ${new Date()}`,
        response: 'unit test create intent response',
      },
    });

    expect(res).toBeDefined();
    expect(res.payload).toBeInstanceOf(Object);
    expect(res.payload).toHaveProperty('id');
    expect(res.payload).toHaveProperty('payload.category');
    expect(res.payload).toHaveProperty('payload.subCategory');
    expect(res.payload).toHaveProperty('payload.sampleQuestion');
    expect(res.payload).toHaveProperty('payload.responses');
  });

  it('should fail if one of these key word not exists when create new intent', async () => {
    expect.hasAssertions();
    const keys = ['category', 'subCategory', 'sampleQuestion', 'response'];
    const body = {
      category: 'BORROW',
      subCategory: 'GENERAL',
      sampleQuestion: 'This will fail intentionally during the test.',
      response: 'This will not insert into the db',
    };

    for (let i = 0; i < keys.length; i += 1) {
      try {
        await api.execute(endpoint, {
          method: 'PUT',
          body: pick(body, pull(keys, keys[i])),
        });
      } catch (e) {
        expect(e).toBeDefined();
        expect(e.response.body).toBeDefined();
        expect(e.response.body).toHaveProperty('statusCode');
        expect(e.response.body.statusCode).toEqual(422);
      }
    }
  });

  it('should update one of the response', async () => {
    const intent = sample((await api.execute(endpoint)).payload);
    const { id: resourceId, responses } = intent;

    const res = await api.execute(`${endpoint}/${resourceId}`, {
      method: 'PATCH',
      body: {
        responses,
      },
    });

    expect(res).toBeDefined();
    expect(res.payload).toBeInstanceOf(Array);
    expect(res.payload.length).toEqual(1);
    res.payload.forEach((element) => {
      expect(element).toHaveProperty('id');
      expect(element).toHaveProperty('category');
      expect(element).toHaveProperty('subCategory');
      expect(element).toHaveProperty('sampleQuestion');
      expect(element).toHaveProperty('responses');
      expect(element.responses).toBeInstanceOf(Array);
      if (element.hasOwnProperty('pendingAction')) {
        expect(element.responses).toEqual('DELETE');
      }
    });
  });

  it('should fail if update an non-existing intent', async () => {
    expect.hasAssertions();
    try {
      const id = Types.ObjectId();
      await api.execute(`${endpoint}/${id}`, {
        method: 'PATCH',
      });
    } catch (e) {
      expect(e).toBeDefined();
      expect(e.response.body).toBeDefined();
      expect(e.response.body).toHaveProperty('statusCode');
      expect(e.response.body.statusCode).toEqual(422);
    }
  });

  it('should update one of the sample question', async () => {
    const intent = sample((await api.execute(endpoint)).payload);
    const { id: resourceId, sampleQuestion } = intent;

    const res = await api.execute(`${endpoint}/${resourceId}`, {
      method: 'PATCH',
      body: {
        sampleQuestion: `${sampleQuestion} <=unit test=>`,
      },
    });

    expect(res).toBeDefined();
    expect(res.payload).toBeInstanceOf(Array);
    expect(res.payload.length).toEqual(1);
    res.payload.forEach((element) => {
      expect(element).toHaveProperty('id');
      expect(element).toHaveProperty('category');
      expect(element).toHaveProperty('subCategory');
      expect(element).toHaveProperty('sampleQuestion');
      expect(element).toHaveProperty('responses');
      expect(element.responses).toBeInstanceOf(Array);
      if (element.hasOwnProperty('pendingAction')) {
        expect(element.responses).toEqual('DELETE');
      }
    });
  });

  it('should create a remove ticket for one of the intent', async () => {
    const {
      id: resourceId,
      category,
      subCategory,
    } = sample(
        reject<{
          id: string;
          category: string;
          subCategory: string;
          pendingAction: string;
        }>((await api.execute(endpoint)).payload, { pendingAction: 'DELETE' }),
      );

    const res = await api.execute(`${endpoint}/${resourceId}`, {
      method: 'DELETE',
    });

    expect(res).toBeDefined();
    expect(typeof res.payload).toBe('string');
    expect(res.payload).toEqual([category, subCategory, resourceId].join('.'));
  });

  it('should create an request for delete an already deleted resource', async () => {
    const { id } = sample(
      filter<{
        id: string;
        category: string;
        subCategory: string;
        pendingAction: string;
      }>((await api.execute(endpoint)).payload, { pendingAction: 'DELETE' }),
    );

    const res = await api.execute(`${endpoint}/${id}`, {
      method: 'DELETE',
    });

    expect(res).toBeDefined();
    expect(typeof res.payload).toBe('string');
    expect(res.payload).toBe('already pending for deletion');
  });

  it('should fail when request to delete an non-existing intent', async () => {
    expect.hasAssertions();
    try {
      const id = Types.ObjectId();
      await api.execute(`${endpoint}/${id}`, {
        method: 'DELETE',
      });
    } catch (e) {
      expect(e).toBeDefined();
      expect(e.response.body).toBeDefined();
      expect(e.response.body).toHaveProperty('statusCode');
      expect(e.response.body.statusCode).toEqual(422);
    }
  });
});
