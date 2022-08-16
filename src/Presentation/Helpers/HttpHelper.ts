import { HttpResponse } from '../Protocols';
import { ServerError } from '../Errors';
import { UnauthorizedError } from '../Errors/UnauthorizedError';

export const BadRequest = (error: Error): HttpResponse => ({
    statusCode: 400,
    body: error,
});

export const ServerErrorResponse = (error: Error): HttpResponse => ({
    statusCode: 500,
    body: new ServerError(error.stack),
});

export const Unauthorized = (): HttpResponse => ({
    statusCode: 401,
    body: new UnauthorizedError(),
});

export const Success = (body: object) => ({
    statusCode: 200,
    body,
});
