import { formatJsonError, formatJsonResponse, ValidatedEventApiGatewayProxyEvent } from '@libs/api-gateway';
import { middyfy } from '@libs/lambda';
import { PrismaClient } from '@prisma/client';

import schema from './schema';

const prisma = new PrismaClient();

const update: ValidatedEventApiGatewayProxyEvent<typeof schema> = async (event) => {
  return prisma.user
    .update({
      where: {
        id: event.body.id,
      },
      data: {
        firstName: event.body.firstName,
        lastName: event.body.lastName,
        phoneNumber: event.body.phoneNumber,
        locale: event.body.locale,
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

export const main = middyfy(update);
