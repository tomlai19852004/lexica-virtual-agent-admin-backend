import { isNil } from 'lodash';
import { before, after, api } from '../Shared';

const senderInfoId = '5a1bcedcac017e4514ea28bb';
const messageId = '5a5738cac5c0923259e8d974';

const createEndpoint = (senderInfoId: string, messageId?: string) => {
  if (isNil(messageId)) {
    return `/conversations/${senderInfoId}/messages`;
  }
  return `/conversations/${senderInfoId}/messages/${messageId}`;
};

before();
after();

describe('Message API', () => {

  it('should set rate and comment on message', async () => {
    const resp = await api.execute(createEndpoint(senderInfoId, messageId), {
      method: 'PATCH',
      body: {
        comment: {
          rating: 5,
          text: 'hello',
          newType: true,
        },
      },
    });
    expect(resp.payload).toBeDefined();
    expect(resp.payload.comment.rating).toBe(5);
    expect(resp.payload.comment.text).toBe('hello');
    expect(resp.payload.comment.newType).toBe(true);
  });

});
