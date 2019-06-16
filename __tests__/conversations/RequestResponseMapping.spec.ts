import { before, after, api } from '../Shared';

const endpoint = '/conversations/request-response-mappings';
const id = '5a57317cc5c0923259e8d972';

before();
after();

describe('Request Response Mappings API', () => {

  it('should return page with one element', async () => {
    const resp = await api.execute(endpoint);
    expect(resp.payload).toBeDefined();
    expect(resp.payload.elements).toHaveLength(1);
    expect(resp.payload.totalElements).toBe(1);
    resp.payload.elements.forEach((e) => {
      expect(e.requestMessages).toHaveLength(1);
      expect(e.responsesMessages).toHaveLength(1);
    });
  });

  it('should return single element when given ID', async () => {
    const resp = await api.execute(`${endpoint}/${id}`);
    expect(resp.payload).toBeDefined();
    expect(resp.payload.id).toBe(id);
    expect(resp.payload.requestMessages).toHaveLength(1);
    expect(resp.payload.responsesMessages).toHaveLength(1);
  });

  it('should create mapping', async () => {
    const resp = await api.execute(endpoint, {
      method: 'POST',
      body: {
        requests: ['5a573895c5c0923259e8d973'],
        responses: ['5a5738cac5c0923259e8d974'],
      },
    });
    const page = await api.execute(endpoint);
    expect(resp.payload.id).toBeDefined();
    expect(resp.payload.requestMessages).toHaveLength(1);
    expect(resp.payload.responsesMessages).toHaveLength(1);
    expect(resp.payload.requestMessages[0].id).toBe('5a573895c5c0923259e8d973');
    expect(resp.payload.responsesMessages[0].id).toBe('5a5738cac5c0923259e8d974');
    expect(page.payload.elements).toHaveLength(2);
    expect(page.payload.totalElements).toBe(2);
    page.payload.elements.forEach((e) => {
      expect(e.requestMessages).toHaveLength(1);
      expect(e.responsesMessages).toHaveLength(1);
    });
  });

  it('should delete mapping', async () => {
    const resp = await api.execute(`${endpoint}/${id}`, {
      method: 'DELETE',
    });
    const page = await api.execute(endpoint);
    expect(resp.payload).toBe(true);
    expect(page.payload.elements).toHaveLength(1);
    expect(page.payload.totalElements).toBe(1);
  });

});
