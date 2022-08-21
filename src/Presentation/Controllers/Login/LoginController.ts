import { Controller, HttpRequest, HttpResponse } from '../../Protocols';
import {
    BadRequest,
    ServerErrorResponse,
    Success,
    Unauthorized,
} from '../../Helpers/HttpHelper';
import { Authentication } from '../../../Domain/useCases/Authentication';
import { Validation } from '../../Protocols/Validation';

export class LoginController implements Controller {
    constructor(
        private readonly authentication: Authentication,
        private readonly validation: Validation,
    ) {}

    async handle(req: HttpRequest): Promise<HttpResponse> {
        try {
            const error = this.validation.validate(req.body);
            if (error) {
                return BadRequest(error);
            }

            const { email, password } = req.body;

            const token = await this.authentication.auth({ email, password });
            if (!token) {
                return Unauthorized();
            }

            return Success({});
        } catch (err) {
            return ServerErrorResponse(err as Error);
        }
    }
}
