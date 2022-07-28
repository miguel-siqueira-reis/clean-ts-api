import { HttpRequest, HttpResponse } from '../Protocols/Http/Http';
import { MissingParamError } from '../Errors/MissingParam';
import { BadRequest } from '../Helpers/HttpHelper';

export class SignUpController {
    public handle(req: HttpRequest): HttpResponse {
        const { name, email } = req.body;

        if (!name) {
            return BadRequest(new MissingParamError('name'));
        }

        if (!email) {
            return BadRequest(new MissingParamError('email'));
        }

        return {
            statusCode: 200,
            body: {},
        };
    }
}
