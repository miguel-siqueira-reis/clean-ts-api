import { Controller, HttpRequest, HttpResponse } from '../Protocols';
import { InvalidParamError, MissingParamError } from '../Errors';
import {
    BadRequest,
    ServerErrorResponse,
    Success,
    Unauthorized,
} from '../Helpers/HttpHelper';
import { Authentication } from '../../Domain/useCases/Authentication';
import { Validation } from '../Helpers/Validators/Validation';

export class LoginController implements Controller {
    private readonly authentication: Authentication;

    public readonly validation: Validation;

    constructor(authentication: Authentication, validation: Validation) {
        this.authentication = authentication;
        this.validation = validation;
    }

    async handle(req: HttpRequest): Promise<HttpResponse> {
        try {
            const error = this.validation.validate(req.body);
            if (error) {
                return BadRequest(error);
            }

            const { email, password } = req.body;

            const token = await this.authentication.auth(email, password);
            if (!token) {
                return Unauthorized();
            }

            return Success({});
        } catch (err) {
            return ServerErrorResponse(err as Error);
        }
    }
}
