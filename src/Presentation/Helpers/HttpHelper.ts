import { HttpResponse } from '../Protocols/Http';
import { ServerError } from '../Errors/ServerError';

export const BadRequest = (error: Error): HttpResponse => ({
    statusCode: 400,
    body: error,
});

export const ServerErrorRequest = (): HttpResponse => ({
    statusCode: 500,
    body: new ServerError(),
});
