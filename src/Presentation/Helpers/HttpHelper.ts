import { HttpResponse } from '../Protocols';
import { ServerError } from '../Errors';

export const BadRequest = (error: Error): HttpResponse => ({
    statusCode: 400,
    body: error,
});

export const ServerErrorResponse = (error: Error): HttpResponse => ({
    statusCode: 500,
    body: new ServerError(error.stack),
});

export const Success = (body: object) => ({
    statusCode: 200,
    body,
});
