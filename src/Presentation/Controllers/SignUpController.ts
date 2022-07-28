import { HttpRequest, HttpResponse } from '../Protocols/Http/Http';

export class SignUpController {
    public handle(req: HttpRequest): HttpResponse {
        const { name, email } = req.body;

        if (!name) {
            return {
                statusCode: 400,
                body: new Error('Missing param: name'),
            };
        }

        if (!email) {
            return {
                statusCode: 400,
                body: new Error('Missing param: email'),
            };
        }

        return {
            statusCode: 200,
            body: {},
        };
    }
}
