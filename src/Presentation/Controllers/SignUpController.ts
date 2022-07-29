import { HttpRequest, HttpResponse, Controller } from '../Protocols';
import { EmailValidator } from '../Protocols/EmailValidator';
import { MissingParamError, InvalidParamError } from '../Errors';
import { BadRequest, ServerErrorRequest } from '../Helpers/HttpHelper';
import { AddAccount } from '../../Domain/useCases/AddAccount';

export class SignUpController implements Controller {
    private readonly emailValidator: EmailValidator;

    private readonly addAccount: AddAccount;

    constructor(emailValidator: EmailValidator, addAccount: AddAccount) {
        this.emailValidator = emailValidator;
        this.addAccount = addAccount;
    }

    public handle(req: HttpRequest): HttpResponse {
        try {
            const { name, email, password, passwordConfirmation } = req.body;

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

            if (password !== passwordConfirmation) {
                return BadRequest(
                    new InvalidParamError('passwordConfirmation'),
                );
            }

            const isEmailValid = this.emailValidator.isValid(email);
            if (!isEmailValid) {
                return BadRequest(new InvalidParamError('email'));
            }

            const account = this.addAccount.add({
                name,
                email,
                password,
            });

            return {
                statusCode: 200,
                body: account,
            };
        } catch {
            return ServerErrorRequest();
        }
    }
}
