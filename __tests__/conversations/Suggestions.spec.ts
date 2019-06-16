import { before, after, api } from '../Shared';

const endpoint = '/conversations/suggestions';

before();
after();

describe.skip('Suggested Answer API', () => {
  it('should return question answer pairs', async () => {
    const resp = await api.execute(endpoint, {
      method: 'POST',
      body: {
        msg: 'hi',
      },
    });
    expect(resp).toHaveProperty('payload');
    expect(resp.payload).toHaveLength(5);
    resp.payload.forEach((pair) => {
      expect(pair).toHaveProperty('question');
      expect(pair).toHaveProperty('answer');
    });
  });
});
