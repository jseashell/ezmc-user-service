import { formatJsonError, formatJsonResponse, ValidatedEventApiGatewayProxyEvent } from '@libs/api-gateway';
import { middyfy } from '@libs/lambda';
import { PrismaClient } from '@prisma/client';

import schema from './schema';

const prisma = new PrismaClient();

const deleteFunc: ValidatedEventApiGatewayProxyEvent<typeof schema> = async (event) => {
  return prisma.user
    .delete({
      where: {
        id: event.body.id,
      },
    })
    .then((user) => {
      return formatJsonResponse({
        message: 'Success',
        data: user,
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

export const main = middyfy(deleteFunc);
