import { HttpRequest, HttpResponse, Controller } from '../Protocols';
import {
    BadRequest,
    ServerErrorResponse,
    Success,
} from '../Helpers/HttpHelper';
import { AddAccount } from '../../Domain/useCases/AddAccount';
import { Validation } from '../Protocols/Validation';

export class SignUpController implements Controller {
    private readonly addAccount: AddAccount;

    private readonly validation: Validation;

    constructor(addAccount: AddAccount, validation: Validation) {
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
