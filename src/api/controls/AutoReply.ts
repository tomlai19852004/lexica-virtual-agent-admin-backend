import * as Boom  from 'boom';
import * as Router from 'koa-router';
import { isNil } from 'lodash';
import { configRepository, ConfigModel } from 'lexica-dialog-repository';
import { CONFIG_KEYS } from '../../Constants';

const router = new Router();

router.get('/auto-reply', async (ctx) => {
  const { uni } = ctx.state.user;
  ctx.status = 200;
  const autoReply = await configRepository
    .findConfigByUniAndKey(uni, CONFIG_KEYS.SUSPEND_AUTO_REPLY);
  if (!isNil(autoReply)) {
    const { key, value } = autoReply;
    ctx.body = { [key]: value };
  } else {
    const result = await configRepository.create({
      key: CONFIG_KEYS.SUSPEND_AUTO_REPLY,
      uni,
      value: false,
    });
    const { key, value } = result;
    ctx.body = { [key]: value };
  }
});

router.put('/auto-reply/:status', async (ctx) => {
  const { uni } = ctx.state.user;
  const { status } = ctx.params;
  if (status === 'on' || status === 'off') {
    ctx.status = 200;
    const nextStatus = status !== 'on';
    let autoReply: ConfigModel | null;
    autoReply = await configRepository.findConfigByUniAndKey(uni, CONFIG_KEYS.SUSPEND_AUTO_REPLY);
    if (!isNil(autoReply)) {
      autoReply.value = nextStatus;
      autoReply.save();
    } else {
      autoReply = await configRepository.create({
        key: CONFIG_KEYS.SUSPEND_AUTO_REPLY,
        uni,
        value: nextStatus,
      });
    }
    ctx.body = {
      message: 'ok',
    };
  }
});

export default router;
