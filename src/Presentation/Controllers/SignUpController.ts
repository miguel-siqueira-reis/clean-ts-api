import { HttpRequest, HttpResponse, Controller } from '../Protocols';
import { EmailValidator } from '../Protocols/EmailValidator';
import { MissingParamError, InvalidParamError } from '../Errors';
import {
    BadRequest,
    ServerErrorResponse,
    Success,
} from '../Helpers/HttpHelper';
import { AddAccount } from '../../Domain/useCases/AddAccount';
import { Validation } from '../Helpers/Validators/Validation';

export class SignUpController implements Controller {
    private readonly emailValidator: EmailValidator;

    private readonly addAccount: AddAccount;

    private readonly validation: Validation;

    constructor(
        emailValidator: EmailValidator,
        addAccount: AddAccount,
        validation: Validation,
    ) {
        this.emailValidator = emailValidator;
        this.addAccount = addAccount;
        this.validation = validation;
    }

    public async handle(req: HttpRequest): Promise<HttpResponse> {
        try {
            this.validation.validate(req.body);
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

            const { name, email, password, passwordConfirmation } = req.body;

            if (password !== passwordConfirmation) {
                return BadRequest(
                    new InvalidParamError('passwordConfirmation'),
                );
            }

            const isEmailValid = this.emailValidator.isValid(email);
            if (!isEmailValid) {
                return BadRequest(new InvalidParamError('email'));
            }

            const account = await this.addAccount.add({
                name,
                email,
                password,
            });

            return Success(account);
        } catch (err) {
            return ServerErrorResponse(err as Error);
        }
    }
}
