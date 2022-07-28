import { HttpResponse } from '../Protocols/Http/Http';

export const BadRequest = (error: Error): HttpResponse => ({
    statusCode: 400,
    body: error,
});
