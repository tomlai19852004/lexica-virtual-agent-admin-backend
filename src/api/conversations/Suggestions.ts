import * as Router from 'koa-router';
import * as req from 'request-promise-native';
import { ENV_CONFIGS } from '../../Constants';

const router = new Router();

router.post('/suggestions', async (ctx) => {
  const {
    state: {
      user: {
        uni,
      },
    uniConfigs,
    },
    request: {
      body: {
        msg,
      },
    },
  } = ctx;

  // No suggestion if NLP server for suggestion is not set.
  if(ENV_CONFIGS.SUGGESTION_SERVER_URL){
    const suggestionsServerResponse = await req({
      json: {
        msg,
        uni,
      },
      method: 'POST',
      url: ENV_CONFIGS.SUGGESTION_SERVER_URL,
    });
    ctx.body = suggestionsServerResponse.map((obj: any) => ({
      answer: obj.lib_response,
      question: obj.msg,
    }));
  } else {
    ctx.body = [];
  }
  
});

export default router;
