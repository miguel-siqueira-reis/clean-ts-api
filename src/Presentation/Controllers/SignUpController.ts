import {
    HttpRequest,
    HttpResponse,
    Controller,
    EmailValidator,
} from '../Protocols';
import { MissingParamError, InvalidParamError } from '../Errors';
import { BadRequest, ServerErrorRequest } from '../Helpers/HttpHelper';

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
            return ServerErrorRequest();
        }
    }
}
