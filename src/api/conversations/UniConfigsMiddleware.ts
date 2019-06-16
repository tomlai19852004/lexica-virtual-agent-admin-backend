import { List, Map } from 'immutable';
import { Middleware, Context } from 'koa';
import {
  Config,
} from 'lexica-dialog-model/dist/Config';
import {
  configRepository,
} from 'lexica-dialog-repository';
import { GLOBAL_UNI } from '../../Constants';


const toConfigMap = (configs: Config[]) => {
  return configs.reduce((map, config) => map.set(config.key, config), Map<string, Config>({}));
};

const uniConfigsMiddleware = () => {
  const middleware: Middleware = async (ctx, next) => {
    const {
      state: {
        user: {
          uni,
        },
      },
    } = ctx;
    const globalConfigs = toConfigMap(await configRepository.findByUni(GLOBAL_UNI));
    ctx.state.uniConfigs = globalConfigs.merge(toConfigMap(await configRepository.findByUni(uni)));
    await next();
  };
  return middleware;
};

export {
  uniConfigsMiddleware,
};
