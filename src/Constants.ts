require('dotenv').config();

const env = process.env;
const ENV_CONFIGS = {
  AWS_ACCESS_KEY_ID: env.AWS_ACCESS_KEY_ID as string,
  AWS_CHATBOT_S3_API_VERSION: env.AWS_CHATBOT_S3_API_VERSION as string,
  AWS_CHATBOT_S3_BUCKET: env.AWS_CHATBOT_S3_BUCKET as string,
  AWS_CHATBOT_SES_API_VERSION: env.AWS_CHATBOT_SES_API_VERSION as string,
  AWS_CHATBOT_SES_REGION: env.AWS_CHATBOT_SES_REGION as string,
  AWS_CHATBOT_SES_SENDER: env.AWS_CHATBOT_SES_SENDER as string,
  AWS_REGION: env.AWS_REGION as string,
  AWS_SECRET_ACCESS_KEY: env.AWS_SECRET_ACCESS_KEY as string,
  JWT_EXPIRE_SECOND: env.JWT_EXPIRE_SECOND as string,
  JWT_KEY: env.JWT_KEY as string,
  MONGO_URL: env.MONGO_URL as string,
  PORT: env.PORT as string,
  SCRYPT_KEYLEN: parseInt(env.SCRYPT_KEYLEN as string, 10) as number,
  SCRYPT_N: env.SCRYPT_N as string,
  SCRYPT_P: env.SCRYPT_P as string,
  SCRYPT_R: env.SCRYPT_R as string,
  SCRYPT_SALT: env.SCRYPT_SALT as string,
  SUGGESTION_SERVER_URL: env.SUGGESTION_SERVER_URL as string,
};

const CONFIG_KEYS = {
  LIBRARIAN_INDICATOR: 'LIBRARIAN_INDICATOR',
  PREPEND_MESSAGES_PRIOR_TO_LIBRARIAN_REPLY: 'PREPEND_MESSAGES_PRIOR_TO_LIBRARIAN_REPLY',
  RECREATE_ISSUE_KEY_WORD: 'RECREATE_ISSUE_KEY_WORD',
  SUSPEND_AUTO_REPLY: 'SUSPEND_AUTO_REPLY',
  TOKENS_TYPES: 'TOKENS_TYPES',
};

const GLOBAL_UNI = 'GLOBAL';

Object.keys(ENV_CONFIGS).forEach((variable) => {
  if (env[variable] === undefined) {
    throw new Error(`Missing environment variable: ${variable}`);
  }
});

export {
  ENV_CONFIGS,
  CONFIG_KEYS,
  GLOBAL_UNI,
};
