settings();
import { start, stop } from '../src/Server';
import { ENV_CONFIGS } from '../src/Constants';
import * as request from 'request-promise-native';
import { createTestData } from './insertTestData';
import * as mongoose from 'mongoose';

const { PORT, UPDATE_DB, MONGO_URL } = process.env;

function settings() {
  require('dotenv').config();
  process.env.AWS_ACCESS_KEY_ID = process.env.TESTING_AWS_ACCESS_KEY_ID;
  process.env.AWS_SECRET_ACCESS_KEY = process.env.TESTING_AWS_SECRET_ACCESS_KEY;
  process.env.AWS_REGION = process.env.TESTING_AWS_REGION;
  process.env.AWS_CHATBOT_S3_API_VERSION = process.env.TESTING_AWS_CHATBOT_S3_API_VERSION;
  process.env.AWS_CHATBOT_S3_BUCKET = process.env.TESTING_AWS_CHATBOT_S3_BUCKET;
  process.env.AWS_CHATBOT_SES_API_VERSION = process.env.TESTING_AWS_CHATBOT_SES_API_VERSION;
  process.env.AWS_CHATBOT_SES_REGION = process.env.TESTING_AWS_CHATBOT_SES_REGION;
  process.env.AWS_CHATBOT_SES_SENDER = process.env.TESTING_AWS_CHATBOT_SES_SENDER;

  jasmine.DEFAULT_TIMEOUT_INTERVAL = 30000;
}

class Api {

  public token: string;

  constructor(
    public username = 'testdev',
    public password = 'password',
    public uni = 'dev') {
  }

  async init() {
    const response = await request({
      url: `http://localhost:${PORT}/api/users/token`,
      method: 'POST',
      json: true,
      body: {
        username: this.username,
        password: this.password,
        uni: this.uni,
      },
    });
    this.token = response.payload.token;
  }

  async destroy() {
    this.token = null;
  }

  async execute(path: string, req?: any) {
    const r = {
      method: 'GET',
      json: true,
      ...req,
    };
    r.url = `http://localhost:${PORT}/api${path}`;
    r.headers = r.headers || {};
    r.headers.Authorization = `bearer ${this.token}`;
    return await request(r);
  }

}

const api = new Api();

const before = () => {
  beforeAll(
    async () => {
      if (UPDATE_DB === 'true') {
        await createTestData(process.env.MONGO_URL);
      }
      await start();
      await api.init();
    },
    10000,
  );
};

const after = () => {
  afterAll(
    async (done) => {
      await stop();
      await api.destroy();
    },
    10000,
  );
};

export {
  before,
  after,
  Api,
  api,
  ENV_CONFIGS,
};
