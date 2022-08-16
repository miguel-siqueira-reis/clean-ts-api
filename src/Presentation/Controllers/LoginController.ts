import { Controller, HttpRequest, HttpResponse } from '../Protocols';
import { InvalidParamError, MissingParamError } from '../Errors';
import {
    BadRequest,
    ServerErrorResponse,
    Success,
} from '../Helpers/HttpHelper';
import { EmailValidator } from '../Protocols/EmailValidator';
import { Authentication } from '../../Domain/useCases/Authentication';

export class LoginController implements Controller {
    private readonly emailValidator: EmailValidator;

    private readonly authentication: Authentication;

    constructor(
        emailValidator: EmailValidator,
        authentication: Authentication,
    ) {
        this.emailValidator = emailValidator;
        this.authentication = authentication;
    }

    async handle(req: HttpRequest): Promise<HttpResponse> {
        try {
            const fieldsRequired = ['email', 'password'];
            for (const field of fieldsRequired) {
                if (!req.body[field]) {
                    return BadRequest(new MissingParamError(field));
                }
            }

            const { email, password } = req.body;

            const isValidEmail = this.emailValidator.isValid(email);
            if (!isValidEmail) {
                return BadRequest(new InvalidParamError('email'));
            }

            await this.authentication.auth(email, password);

            return Success({});
        } catch (err) {
            return ServerErrorResponse(err as Error);
        }
    }
}
