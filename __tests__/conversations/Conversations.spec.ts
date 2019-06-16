import { before, after, api } from '../Shared';

const endpoint = '/conversations';

before();
after();

describe('Conversation', async () => {

  it('should return conversations based on sender info', async () => {
    const resp = await api.execute(endpoint, {
      qs: {
        sort: 'lastUpdatedDate,desc',
      },
    });
    expect(resp.payload.totalElements).toBe(102);
  });

  it('should return 50 conversations of dev uni', async () => {
    const resp = await api.execute(endpoint);
    expect(resp).toBeDefined();
    expect(resp.payload).toBeInstanceOf(Object);
    expect(resp.payload).toHaveProperty('elements');
    expect(resp.payload.elements).toHaveLength(50);
    resp.payload.elements.forEach((element) => {
      expect(element).toHaveProperty('id');
      expect(element).toHaveProperty('firstName');
      expect(element).toHaveProperty('lastName');
      expect(element).toHaveProperty('messenger');
      expect(element).toHaveProperty('status');
    });
  });

  it('should return conversations of dev uni (search by name)', async () => {
    const resp = await api.execute(`${endpoint}?query=lawrence`);
    expect(resp).toBeDefined();
    expect(resp.payload).toBeInstanceOf(Object);
    expect(resp.payload).toHaveProperty('elements');
    expect(resp.payload.elements).toHaveLength(1);
    resp.payload.elements.forEach((element) => {
      expect(element).toHaveProperty('id');
      expect(element).toHaveProperty('firstName');
      expect(element).toHaveProperty('lastName');
      expect(element).toHaveProperty('messenger');
      expect(element).toHaveProperty('status');
    });
    expect(resp.payload.elements[0].firstName).toBe('Lawrence');
  });

  it('should return conversations of dev uni (search by ID)', async () => {
    const resp = await api.execute(`${endpoint}?query=5a1bcedcac017e4514ea28bb`);
    expect(resp).toBeDefined();
    expect(resp.payload).toBeInstanceOf(Object);
    expect(resp.payload).toHaveProperty('elements');
    expect(resp.payload.elements).toHaveLength(1);
    resp.payload.elements.forEach((element) => {
      expect(element).toHaveProperty('id');
      expect(element).toHaveProperty('firstName');
      expect(element).toHaveProperty('middleName');
      expect(element).toHaveProperty('lastName');
      expect(element).toHaveProperty('messenger');
      expect(element).toHaveProperty('status');
      expect(element.middleName).toBe('abc');
    });
    expect(resp.payload.elements[0].firstName).toBe('Lawrence');
  });

});
