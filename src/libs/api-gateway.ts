import type { APIGatewayProxyEvent, APIGatewayProxyResult, Handler } from 'aws-lambda';
import type { FromSchema } from 'json-schema-to-ts';

type ValidatedApiGatewayProxyEvent<S> = Omit<APIGatewayProxyEvent, 'body'> & { body: FromSchema<S> };
export type ValidatedEventApiGatewayProxyEvent<S> = Handler<ValidatedApiGatewayProxyEvent<S>, APIGatewayProxyResult>;

const cors = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'OPTIONS, GET, POST',
  'Access-Control-Allow-Headers': 'Content-Type',
};

/**
 * Formats the given data as a Lambda proxy response
 * @param data
 * @returns the response
 */
export const formatJsonResponse = (data: Record<string, unknown>) => {
  return {
    statusCode: 200,
    headers: cors,
    body: JSON.stringify(data),
  };
};

/**
 * Formats the given error as a Lambda proxy response
 * @param error
 * @returns the response
 */
export const formatJsonError = (error: any) => {
  return {
    statusCode: 500,
    headers: cors,
    body: JSON.stringify({ error }),
  };
};
