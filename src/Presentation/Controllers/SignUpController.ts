import { HttpRequest, HttpResponse } from '../Protocols/Http/Http';
import { MissingParamError } from '../Errors/MissingParam';
import { BadRequest } from '../Helpers/HttpHelper';
import { Controller } from '../Protocols/Controller';

export class SignUpController implements Controller {
    public handle(req: HttpRequest): HttpResponse {
        const fieldsRequired = [
            'name',
            'email',
            'password',
            'passwordConfirmation',
        ];
        for (const field of fieldsRequired) {
            if (!req.body[field]) {
                return BadRequest(new MissingParamError(field));
            }
        }

        return {
            statusCode: 200,
            body: {},
        };
    }
}
