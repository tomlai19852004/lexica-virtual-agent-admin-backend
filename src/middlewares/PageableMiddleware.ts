import { Middleware, Context } from 'koa';
import { isNil } from 'lodash';
import { Pageable, PageRequest, Sort, SortDirection } from 'lexica-dialog-repository';

const pageableMiddleware = ({ defaultSize = 50, maxSize = 5000 }) => {
  const middleware: Middleware = async (ctx, next) => {
    let { page, size, sort } = ctx.query;
    let sorts : Sort[];

    if (isNil(page) || page < 0) {
      page = 0;
    } else {
      page = parseInt(page, 10);
    }

    if (isNil(size) || size <= 0) {
      size = defaultSize;
    } else {
      size = parseInt(size, 10);
    }

    if (isNil(sort)) {
      sort = '';
    }

    if (size > maxSize) {
      size = maxSize;
    }

    sorts = (sort as string).split('|')
      .map(str => str.split(','))
      .filter(tokens => tokens.length === 1 || tokens.length === 2)
      .filter(tokens => tokens[0] !== undefined && tokens[0] !== null && tokens[0] !== '')
      .map((tokens) => {
        const name = tokens[0];
        const direction = tokens.length === 1 ? SortDirection.ASC : tokens[1].toLowerCase();
        return {
          direction,
          name,
        };
      })
      .filter(obj => obj.direction === SortDirection.ASC || obj.direction === SortDirection.DESC)
      .map(obj => ({
        ...obj,
        direction: obj.direction === SortDirection.ASC ? SortDirection.ASC : SortDirection.DESC,
      }));

    ctx.state.pageable = new PageRequest(page, size, sorts);
    await next();

  };

  return middleware;
};

export {
  pageableMiddleware,
};
