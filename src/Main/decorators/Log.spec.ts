import { LogControllerDecorator } from './Log';
import {
    Controller,
    HttpRequest,
    HttpResponse,
} from '../../Presentation/Protocols';
import { ServerErrorResponse } from '../../Presentation/Helpers/HttpHelper';
import { LogErrorRepository } from '../../Data/Protocols/LogErrorRepository';

const makeLogErrorRepository = (): LogErrorRepository => {
    class LogErrorRepositoryStub implements LogErrorRepository {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        async log(stack: string): Promise<void> {
            return Promise.resolve();
        }
    }

    return new LogErrorRepositoryStub();
};

const makeControllerStub = (): Controller => {
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
    return new ControllerStub();
};

interface SutTypes {
    sut: LogControllerDecorator;
    controllerStub: Controller;
    logErrorRepository: LogErrorRepository;
}
const makeSut = (): SutTypes => {
    const controllerStub = makeControllerStub();
    const logErrorRepository = makeLogErrorRepository();
    return {
        sut: new LogControllerDecorator(controllerStub, logErrorRepository),
        controllerStub,
        logErrorRepository,
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

    it('should return the same result of the controller', async () => {
        const { sut } = makeSut();
        const httpRequest: HttpRequest = {
            body: {
                name: 'any_name',
                email: 'email@mail.com',
                password: 'any_password',
                passwordConfirmation: 'any_password',
            },
        };
        const httpResponse = await sut.handle(httpRequest);
        expect(httpResponse).toEqual({
            statusCode: 200,
            body: {
                name: 'any_name',
            },
        });
    });

    it('should call logErrorRepository with correct error if controller return server error', async () => {
        const { sut, controllerStub, logErrorRepository } = makeSut();
        const fakeError = new Error('any_error');
        fakeError.stack = 'any_stack';
        jest.spyOn(controllerStub, 'handle').mockReturnValueOnce(
            Promise.resolve(ServerErrorResponse(fakeError)),
        );

        const logSpy = jest.spyOn(logErrorRepository, 'log');
        const httpRequest: HttpRequest = {
            body: {
                name: 'any_name',
                email: 'mail@mail.com',
                password: 'any_password',
                passwordConfirmation: 'any_password',
            },
        };

        await sut.handle(httpRequest);
        expect(logSpy).toHaveBeenCalledWith('any_stack');
    });
});
