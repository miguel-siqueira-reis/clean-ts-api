import {
    Controller,
    HttpRequest,
    HttpResponse,
} from '../../Presentation/Protocols';

export class LogControllerDecorator implements Controller {
    private readonly controller: Controller;

    constructor(controller: Controller) {
        this.controller = controller;
    }

    async handle(request: HttpRequest): Promise<HttpResponse> {
        const httpResponse = await this.controller.handle(request);
        if (httpResponse.statusCode !== 200) {
            // eslint-disable-next-line no-console
            console.error(httpResponse);
        }

        return httpResponse;
    }
}
