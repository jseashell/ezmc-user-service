import { formatJsonError, formatJsonResponse, ValidatedEventApiGatewayProxyEvent } from '@libs/api-gateway';
import { middyfy } from '@libs/lambda';
import { PrismaClient } from '@prisma/client';

import schema from './schema';

const prisma = new PrismaClient();

const create: ValidatedEventApiGatewayProxyEvent<typeof schema> = async (event) => {
  const data = {
    username: event.body.username,
    email: event.body.email,
    firstName: event.body.firstName,
    lastName: event.body.lastName,
    phoneNumber: event.body.phoneNumber,
    locale: event.body.locale,
  };

  return prisma.user
    .create(data)
    .then((user) => {
      return formatJsonResponse(user);
    })
    .catch((err) => {
      console.error(err);
      return formatJsonError(err);
    });
};

export const main = middyfy(create);
