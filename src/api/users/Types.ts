import * as Boom  from 'boom';
import * as Router from 'koa-router';
import { isNil } from 'lodash';
import { configRepository, ConfigModel } from 'lexica-dialog-repository';
import { CONFIG_KEYS, GLOBAL_UNI } from '../../Constants';

const router = new Router();

router.get('/types', async (ctx) => {
  const uniList = await configRepository
    .findConfigByUniAndKey(GLOBAL_UNI, CONFIG_KEYS.TOKENS_TYPES);
  if (!isNil(uniList)) {
    ctx.body = uniList.value;
  } else {
    new Error(`Config: ${CONFIG_KEYS.TOKENS_TYPES} not found of ${GLOBAL_UNI} uni`);
  }
});

export default router;
