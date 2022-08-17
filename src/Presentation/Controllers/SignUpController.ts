import { HttpRequest, HttpResponse, Controller } from '../Protocols';
import { EmailValidator } from '../Protocols/EmailValidator';
import { InvalidParamError } from '../Errors';
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
            const error = this.validation.validate(req.body);
            if (error) {
                return BadRequest(error);
            }

            const { name, email, password } = req.body;

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
