import { before, after, api } from '../Shared';

const endpoint = '/data-analytics/message-comments';

before();
after();

describe('Data Analytics: Traffic API', async () => {
  it('should return statistics group by hour', async () => {
    const resp = await api.execute(endpoint, {
      qs: {
        start: new Date('2017-01-01'),
        end: new Date('2017-12-31'),
        group: 'HOUR',
      },
    });
    expect(resp).toBeDefined();
    expect(resp.payload).toBeInstanceOf(Array);
    resp.payload.forEach((element) => {
      expect(element).toHaveProperty('_id');
      expect(element).toHaveProperty('count');
      expect(element._id).toHaveProperty('year');
      expect(element._id).toHaveProperty('month');
      expect(element._id).not.toHaveProperty('week');
      expect(element._id).toHaveProperty('dayOfMonth');
      expect(element._id).toHaveProperty('hour');
      expect(element.count).toBeGreaterThan(0);
    });
  });

  it('should return statistics group by day', async () => {
    const resp = await api.execute(endpoint, {
      qs: {
        start: new Date('2017-01-01'),
        end: new Date('2017-12-31'),
        group: 'DAY',
      },
    });
    expect(resp).toBeDefined();
    expect(resp.payload).toBeInstanceOf(Array);
    resp.payload.forEach((element) => {
      expect(element).toHaveProperty('_id');
      expect(element).toHaveProperty('count');
      expect(element._id).toHaveProperty('year');
      expect(element._id).toHaveProperty('month');
      expect(element._id).not.toHaveProperty('week');
      expect(element._id).toHaveProperty('dayOfMonth');
      expect(element._id).not.toHaveProperty('hour');
      expect(element.count).toBeGreaterThan(0);
    });
  });

  it('should return statistics group by week', async () => {
    const resp = await api.execute(endpoint, {
      qs: {
        start: new Date('2017-01-01'),
        end: new Date('2017-12-31'),
        group: 'WEEK',
      },
    });
    expect(resp).toBeDefined();
    expect(resp.payload).toBeInstanceOf(Array);
    resp.payload.forEach((element) => {
      expect(element).toHaveProperty('_id');
      expect(element).toHaveProperty('count');
      expect(element._id).toHaveProperty('year');
      expect(element._id).toHaveProperty('month');
      expect(element._id).toHaveProperty('week');
      expect(element._id).not.toHaveProperty('dayOfMonth');
      expect(element._id).not.toHaveProperty('hour');
      expect(element.count).toBeGreaterThan(0);
    });
  });

  it('should return statistics group by month', async () => {
    const resp = await api.execute(endpoint, {
      qs: {
        start: new Date('2017-01-01'),
        end: new Date('2017-12-31'),
        group: 'MONTH',
      },
    });
    expect(resp).toBeDefined();
    expect(resp.payload).toBeInstanceOf(Array);
    resp.payload.forEach((element) => {
      expect(element).toHaveProperty('_id');
      expect(element).toHaveProperty('count');
      expect(element._id).toHaveProperty('year');
      expect(element._id).toHaveProperty('month');
      expect(element._id).not.toHaveProperty('week');
      expect(element._id).not.toHaveProperty('dayOfMonth');
      expect(element._id).not.toHaveProperty('hour');
      expect(element.count).toBeGreaterThan(0);
    });
  });
});
