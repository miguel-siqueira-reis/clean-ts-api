import { Controller, HttpRequest, HttpResponse } from '../Protocols';
import { MissingParamError } from '../Errors';
import {
    BadRequest,
    ServerErrorResponse,
    Success,
} from '../Helpers/HttpHelper';

export class LoginController implements Controller {
    async handle(req: HttpRequest): Promise<HttpResponse> {
        try {
            const fieldsRequired = ['email', 'password'];
            for (const field of fieldsRequired) {
                if (!req.body[field]) {
                    return BadRequest(new MissingParamError(field));
                }
            }

            return Success({});
        } catch (err) {
            return ServerErrorResponse(err as Error);
        }
    }
}
