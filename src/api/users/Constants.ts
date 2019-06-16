import { ENV_CONFIGS } from '../../Constants';

const SCRYPT = {
  PARAMS: {
    N: parseInt(ENV_CONFIGS.SCRYPT_N, 10),
    p: parseInt(ENV_CONFIGS.SCRYPT_P, 10),
    r: parseInt(ENV_CONFIGS.SCRYPT_R, 10),
  },
};

const SCRYPT_SALT = ENV_CONFIGS.SCRYPT_SALT;
const SCRYPT_KEYLEN = ENV_CONFIGS.SCRYPT_KEYLEN;

export {
  SCRYPT,
  SCRYPT_SALT,
  SCRYPT_KEYLEN
};
