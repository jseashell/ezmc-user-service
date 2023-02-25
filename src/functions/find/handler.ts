import { formatJsonError, formatJsonResponse, ValidatedEventApiGatewayProxyEvent } from '@libs/api-gateway';
import { middyfy } from '@libs/lambda';
import { PrismaClient } from '@prisma/client';

import schema from './schema';

const prisma = new PrismaClient();

const find: ValidatedEventApiGatewayProxyEvent<typeof schema> = async (event) => {
  return prisma.user
    .findUniqueOrThrow({
      where: {
        email: event.body.email,
      },
    })
    .then((users) => {
      return formatJsonResponse({
        message: 'Success',
        data: users,
      });
    })
    .catch((err) => {
      console.error(err);
      return formatJsonError({
        message: 'Failure',
        error: err,
      });
    });
};

export const main = middyfy(find);
