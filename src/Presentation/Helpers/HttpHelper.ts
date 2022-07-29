import { HttpResponse } from '../Protocols';
import { ServerError } from '../Errors';

export const BadRequest = (error: Error): HttpResponse => ({
    statusCode: 400,
    body: error,
});

export const ServerErrorRequest = (): HttpResponse => ({
    statusCode: 500,
    body: new ServerError(),
});
