import { HttpRequest, HttpResponse } from '../Protocols/Http/Http';

export class SignUpController {
    public handle(req: HttpRequest): HttpResponse {
        return {
            statusCode: 400,
            body: new Error('Name is required'),
        };
    }
}
