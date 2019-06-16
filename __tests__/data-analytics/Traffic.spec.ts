import { before, after, api } from '../Shared';

const endpoint = '/data-analytics/traffic';

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

  it('should return categories statistics group by hour', async () => {
    const resp = await api.execute(endpoint, {
      qs: {
        start: new Date('2017-01-01'),
        end: new Date('2017-12-31'),
        group: 'HOUR',
        type: 'CATEGORIES',
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
      expect(element._id).toHaveProperty('category');
      expect(element.count).toBeGreaterThan(0);
    });
  });

  it('should return channels statistics group by hour', async () => {
    const resp = await api.execute(endpoint, {
      qs: {
        start: new Date('2017-01-01'),
        end: new Date('2017-12-31'),
        group: 'HOUR',
        type: 'CHANNELS',
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
      expect(element._id).toHaveProperty('channel');
      expect(element.count).toBeGreaterThan(0);
    });
  });

  it('should sort by ASC sequence', async () => {
    const resp = await api.execute(endpoint, {
      qs: {
        start: new Date('2017-01-01'),
        end: new Date('2017-12-31'),
        group: 'HOUR',
      },
    });
    let prevTimestamp;
    expect(resp).toBeDefined();
    expect(resp.payload).toBeInstanceOf(Array);
    resp.payload.forEach((element) => {
      const { year, month, dayOfMonth, hour } = element._id;
      const timestamp = new Date(year, parseInt(month, 10) - 1, dayOfMonth, hour).getTime();
      if (prevTimestamp && timestamp) {
        expect(prevTimestamp).toBeLessThan(timestamp);
      }
      prevTimestamp = timestamp;
    });
  });

  it('should throw error when invalid group', async () => {
    expect.hasAssertions();
    try {
      await api.execute(endpoint, {
        qs: {
          start: new Date('2017-01-01'),
          end: new Date('2017-12-31'),
          group: 'XX',
        },
      });
    } catch (e) {
      expect(e.response.body).toBeDefined();
      expect(e.response.body).toHaveProperty('statusCode');
      expect(e.response.body.statusCode).toBe(400);
    }
  });

  it('should throw error when invalid type', async () => {
    expect.hasAssertions();
    try {
      await api.execute(endpoint, {
        qs: {
          start: new Date('2017-01-01'),
          end: new Date('2017-12-31'),
          type: 'XX',
        },
      });
    } catch (e) {
      expect(e.response.body).toBeDefined();
      expect(e.response.body).toHaveProperty('statusCode');
      expect(e.response.body.statusCode).toBe(400);
    }
  });

});
