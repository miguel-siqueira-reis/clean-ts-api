import { HttpRequest, HttpResponse } from '../Protocols/Http';
import { MissingParamError } from '../Errors/MissingParam';
import { InvalidParamError } from '../Errors/InvalidParam';
import { BadRequest } from '../Helpers/HttpHelper';
import { Controller } from '../Protocols/Controller';
import { EmailValidator } from '../Protocols/EmailValidator';
import { ServerError } from '../Errors/ServerError';

export class SignUpController implements Controller {
    private readonly emailValidator: EmailValidator;

    constructor(emailValidator: EmailValidator) {
        this.emailValidator = emailValidator;
    }

    public handle(req: HttpRequest): HttpResponse {
        try {
            const { email } = req.body;

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

            const isEmailValid = this.emailValidator.isValid(email);
            if (!isEmailValid) {
                return BadRequest(new InvalidParamError('email'));
            }

            return {
                statusCode: 200,
                body: {},
            };
        } catch {
            return {
                statusCode: 500,
                body: new ServerError(),
            };
        }
    }
}
