import { formatJsonError, formatJsonResponse, ValidatedEventApiGatewayProxyEvent } from '@libs/api-gateway';
import { middyfy } from '@libs/lambda';
import { PrismaClient } from '@prisma/client';

import schema from './schema';

const prisma = new PrismaClient();

const findAll: ValidatedEventApiGatewayProxyEvent<typeof schema> = async (_event) => {
  return prisma.user
    .findMany()
    .then((users) => {
      return formatJsonResponse({
        message: 'Success',
        data: users,
      });
    })
    .catch((error) => {
      console.error(error);
      return formatJsonError(error);
    });
};

export const main = middyfy(findAll);
