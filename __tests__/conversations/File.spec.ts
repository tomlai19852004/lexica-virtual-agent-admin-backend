import { before, after, api } from '../Shared';
import { senderInfo } from '../TestData/SenderInfo';

const createEndPoint = (senderInfoId, messageId, token) =>
  `/conversations/${senderInfoId}/messages/${messageId}/file?token=${token}`;

before();
after();

describe('S3 Downloader stream API', async () => {
  it('should return image/png content-type', async () => {
    const senderInfoId = '5a1bcedcac017e4514ea28bb';
    const messageId = '5a17c0a57f077d30aae8118d';
    const resp = await api.execute(
      createEndPoint(senderInfoId, messageId, api.token),
      { resolveWithFullResponse: true },
    );
    expect(resp).toBeDefined();
    expect(resp.headers).toBeDefined();
    expect(resp.headers['content-type']).toBeDefined();
    expect(resp.headers['content-type']).toBe('image/png');
  });

  it('should return image/png content-type', async () => {
    const senderInfoId = '5a1bcedcac017e4514ea28bb';
    const messageId = '5a1ccf38963b253062d663f5';
    const resp = await api.execute(
      createEndPoint(senderInfoId, messageId, api.token),
      { resolveWithFullResponse: true },
    );
    expect(resp).toBeDefined();
    expect(resp.headers).toBeDefined();
    expect(resp.headers['content-type']).toBeDefined();
    expect(resp.headers['content-type']).toBe('image/png');
  });

  it('should return audio/mp3 content-type', async () => {
    const senderInfoId = '5a1bcedcac017e4514ea28bb';
    const messageId = '5a1d04090ec0f3b7d3506cb1';
    const resp = await api.execute(
      createEndPoint(senderInfoId, messageId, api.token),
      { resolveWithFullResponse: true },
    );
    expect(resp).toBeDefined();
    expect(resp.headers).toBeDefined();
    expect(resp.headers['content-type']).toBeDefined();
    expect(resp.headers['content-type']).toBe('audio/mp3');
  });

  it('should throw error when messageId is invalid', async () => {
    const senderInfoId = '5a1bcedcac017e4514ea28bb';
    const messageId = 'badmsg00001';
    expect.hasAssertions();
    try {
      const resp = await api.execute(
        createEndPoint(senderInfoId, messageId, api.token),
        { resolveWithFullResponse: true },
      );
    } catch (error) {
      expect(error.response).toBeDefined();
      expect(error.response.statusCode).toBe(500);
    }
  });

  it('should throw error when senderInfoId is invalid', async () => {
    const senderInfoId = 'badsenderinfoid';
    const messageId = '5a1d04090ec0f3b7d3506cb1';
    expect.hasAssertions();
    try {
      const resp = await api.execute(
        createEndPoint(senderInfoId, messageId, api.token),
        { resolveWithFullResponse: true },
      );
    } catch (error) {
      expect(error.response).toBeDefined();
      expect(error.response.statusCode).toBe(500);
    }
  });

});

