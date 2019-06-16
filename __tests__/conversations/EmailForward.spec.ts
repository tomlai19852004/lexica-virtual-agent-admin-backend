import { before, after, api, ENV_CONFIGS } from '../Shared';

const endpoint = '/conversations/email';

before();
after();

describe('Email Forward API', () => {

  it('should send email', async () => {
    const resp = await api.execute(endpoint, {
      method: 'POST',
      body: {
        to: [
          ENV_CONFIGS.AWS_CHATBOT_SES_SENDER,
        ],
        subject: `lexica-librarian-ui-backend unit test - ${Date.now()}`,
        body: `${Date.now()}`,
      },
    });
    expect(resp.payload).toBe('ok');
  });

});
