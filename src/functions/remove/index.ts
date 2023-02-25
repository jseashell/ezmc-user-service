import { handlerPath } from '@libs/handler-resolver';
import schema from './schema';

export default {
  handler: `${handlerPath(__dirname)}/handler.main`,
  events: [
    {
      http: {
        method: 'delete',
        path: 'delete',
        request: {
          schemas: {
            'application/json': schema,
          },
        },
      },
    },
  ],
};
