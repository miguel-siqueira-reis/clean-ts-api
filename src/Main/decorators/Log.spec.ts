import { LogControllerDecorator } from './Log';
import {
    Controller,
    HttpRequest,
    HttpResponse,
} from '../../Presentation/Protocols';

interface SutTypes {
    sut: LogControllerDecorator;
    controllerStub: Controller;
}
const makeSut = (): SutTypes => {
    class ControllerStub implements Controller {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
            return {
                statusCode: 200,
                body: {
                    name: 'any_name',
                },
            };
        }
    }

    const controllerStub = new ControllerStub();

    return {
        sut: new LogControllerDecorator(controllerStub),
        controllerStub,
    };
};

describe('LogControllerDecorator', () => {
    it('should call handle method and provide correct params', () => {
        const { sut, controllerStub } = makeSut();
        const handleSpy = jest.spyOn(controllerStub, 'handle');

        const httpRequest: HttpRequest = {
            body: {
                name: 'any_name',
                email: 'email@email.com',
                password: 'any_password',
                passwordConfirmation: 'any_password',
            },
        };
        sut.handle(httpRequest);
        expect(handleSpy).toHaveBeenCalledWith(httpRequest);
    });
});
