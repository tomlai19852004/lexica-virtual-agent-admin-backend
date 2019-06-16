import * as s from '../../Server';
import { SCRYPT, SCRYPT_SALT, SCRYPT_KEYLEN } from './Constants';

const scrypt = require('scrypt');
const toStringAlgorithm = 'base64';

const hashPassword = async (raw: string) => {
  const output = await scrypt.kdf(raw, SCRYPT.PARAMS);
  return output.toString(toStringAlgorithm);
};

const isPasswordMatch = async (raw: string, hashed: string) => {
  return await scrypt.verifyKdf(new Buffer(hashed, toStringAlgorithm), raw);
};


export {
  hashPassword,
  isPasswordMatch,
};
