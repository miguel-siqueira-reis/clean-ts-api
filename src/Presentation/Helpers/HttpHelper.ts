import { HttpResponse } from '../Protocols';
import { ServerError, UnauthorizedError } from '../Errors/loginProtocols';

export const BadRequest = (error: Error): HttpResponse => ({
    statusCode: 400,
    body: {
        error: {
            message: error?.message,
            name: error.name,
        },
    },
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
