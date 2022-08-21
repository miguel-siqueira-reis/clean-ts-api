import { LoginController } from './LoginController';
import {
    BadRequest,
    ServerErrorResponse,
    Unauthorized,
} from '../../Helpers/HttpHelper';
import {
    Authentication,
    AuthenticationData,
} from '../../../Domain/useCases/Authentication';
import { Validation } from '../../Protocols/Validation';
import { MissingParamError } from '../../Errors';
import { HttpRequest } from '../../Protocols';

const makeFakeRequest = (): HttpRequest => ({
    body: {
        email: 'any_mail@mail.com',
        password: 'any_password',
    },
});

const makeValidationStub = (): Validation => {
    class ValidationStub implements Validation {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        validate(input: any): Error | null {
            return null;
        }
    }
    return new ValidationStub();
};

const makeAuthenticationStub = (): Authentication => {
    class AuthenticateStub implements Authentication {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        async auth(authentication: AuthenticationData): Promise<string | null> {
            return 'any_token';
        }
    }
    return new AuthenticateStub();
};

interface SutTypes {
    sut: LoginController;
    validationStub: Validation;
    authenticationStub: Authentication;
}
const makeSut = (): SutTypes => {
    const authenticationStub = makeAuthenticationStub();
    const validationStub = makeValidationStub();
    const sut = new LoginController(authenticationStub, validationStub);
    return { sut, validationStub, authenticationStub };
};

describe('LoginController', () => {
    it('should call Validation with correct params', async () => {
        const { sut, validationStub } = makeSut();

        const validateSpy = jest.spyOn(validationStub, 'validate');

        const req = makeFakeRequest();
        await sut.handle(req);

        expect(validateSpy).toHaveBeenCalledWith(req.body);
    });

    it('should return 400 if validation returns an error', async () => {
        const { sut, validationStub } = makeSut();

        jest.spyOn(validationStub, 'validate').mockReturnValueOnce(
            new MissingParamError('any_field'),
        );

        const req = makeFakeRequest();
        const response = await sut.handle(req);

        expect(response.statusCode).toBe(400);
        expect(response).toEqual(
            BadRequest(new MissingParamError('any_field')),
        );
    });

    it('should returns 200 if valid data is provided', async () => {
        const { sut } = makeSut();
        const req = makeFakeRequest();

        const httpResponse = await sut.handle(req);
        expect(httpResponse.statusCode).toBe(200);
    });

    it('should calls Authenticate with correct params', async () => {
        const { sut, authenticationStub } = makeSut();
        const authSpy = jest.spyOn(authenticationStub, 'auth');
        const req = makeFakeRequest();

        await sut.handle(req);
        expect(authSpy).toHaveBeenCalledWith({
            email: 'any_mail@mail.com',
            password: 'any_password',
        });
    });

    it('should returns 500 if Authenticate throws', async () => {
        const { sut, authenticationStub } = makeSut();
        jest.spyOn(authenticationStub, 'auth').mockImplementationOnce(() => {
            throw new Error();
        });

        const req = makeFakeRequest();

        const httpResponse = await sut.handle(req);
        expect(httpResponse.statusCode).toBe(500);
        expect(httpResponse).toEqual(ServerErrorResponse(new Error()));
    });

    it('should returns 401 if Authenticate throws when invalid credentials are provided', async () => {
        const { sut, authenticationStub } = makeSut();
        jest.spyOn(authenticationStub, 'auth').mockReturnValueOnce(
            Promise.resolve(null),
        );

        const req = {
            body: {
                email: 'unauthorized_mail@mail.com',
                password: 'unauthorized_password',
            },
        };

        const httpResponse = await sut.handle(req);
        expect(httpResponse.statusCode).toBe(401);
        expect(httpResponse).toEqual(Unauthorized());
    });
});
