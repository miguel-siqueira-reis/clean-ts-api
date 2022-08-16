import { Controller, HttpRequest, HttpResponse } from '../Protocols';
import { InvalidParamError, MissingParamError } from '../Errors';
import {
    BadRequest,
    ServerErrorResponse,
    Success,
} from '../Helpers/HttpHelper';
import { EmailValidator } from '../Protocols/EmailValidator';

export class LoginController implements Controller {
    private readonly emailValidator: EmailValidator;

    constructor(emailValidator: EmailValidator) {
        this.emailValidator = emailValidator;
    }

    async handle(req: HttpRequest): Promise<HttpResponse> {
        try {
            const fieldsRequired = ['email', 'password'];
            for (const field of fieldsRequired) {
                if (!req.body[field]) {
                    return BadRequest(new MissingParamError(field));
                }
            }

            const { email } = req.body;

            const isValidEmail = this.emailValidator.isValid(email);
            if (!isValidEmail) {
                return BadRequest(new InvalidParamError('email'));
            }

            return Success({});
        } catch (err) {
            return ServerErrorResponse(err as Error);
        }
    }
}
