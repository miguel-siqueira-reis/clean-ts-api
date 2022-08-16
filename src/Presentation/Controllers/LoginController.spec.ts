import { InvalidParamError, MissingParamError } from '../Errors';
import { LoginController } from './LoginController';
import { BadRequest, ServerErrorResponse } from '../Helpers/HttpHelper';
import { EmailValidator } from '../Protocols/EmailValidator';
import { Authentication } from '../../Domain/useCases/Authentication';

const makeEmailValidatorStub = (): EmailValidator => {
    class EmailValidatorStub implements EmailValidator {
        isValid(email: string): boolean {
            email.toString();
            return true;
        }
    }
    return new EmailValidatorStub();
};

const makeAuthenticationStub = (): Authentication => {
    class AuthenticateStub implements Authentication {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        async auth(email: string, password: string): Promise<string> {
            return 'any_token';
        }
    }
    return new AuthenticateStub();
};

interface SutTypes {
    sut: LoginController;
    emailValidatorStub: EmailValidator;
    authenticationStub: Authentication;
}
const makeSut = (): SutTypes => {
    const authenticationStub = makeAuthenticationStub();
    const emailValidatorStub = makeEmailValidatorStub();
    const sut = new LoginController(emailValidatorStub, authenticationStub);
    return { sut, emailValidatorStub, authenticationStub };
};

describe('LoginController', () => {
    it('should return 400 if no email is provided', async () => {
        const { sut } = makeSut();
        const req = {
            body: {
                password: 'any_password',
            },
        };

        const httpResponse = await sut.handle(req);
        expect(httpResponse.statusCode).toBe(400);
        expect(httpResponse).toEqual(
            BadRequest(new MissingParamError('email')),
        );
    });

    it('should return 400 if no password is provided', async () => {
        const { sut } = makeSut();
        const req = {
            body: {
                email: 'any_mail@mail.com',
            },
        };

        const httpResponse = await sut.handle(req);
        expect(httpResponse.statusCode).toBe(400);
        expect(httpResponse).toEqual(
            BadRequest(new MissingParamError('password')),
        );
    });

    it('should calls EmailValidator with correct params', async () => {
        const { sut, emailValidatorStub } = makeSut();
        const isValidSpy = jest.spyOn(emailValidatorStub, 'isValid');
        const req = {
            body: {
                email: 'any_mail@mail.com',
                password: 'any_password',
            },
        };

        await sut.handle(req);
        expect(isValidSpy).toHaveBeenCalledWith('any_mail@mail.com');
    });

    it('should returns 400 if an invalid mail is provided', async () => {
        const { sut, emailValidatorStub } = makeSut();
        jest.spyOn(emailValidatorStub, 'isValid').mockReturnValueOnce(false);
        const req = {
            body: {
                email: 'invalid_mail@mail.com',
                password: 'any_password',
            },
        };

        const httpResponse = await sut.handle(req);
        expect(httpResponse.statusCode).toBe(400);
        expect(httpResponse).toEqual(
            BadRequest(new InvalidParamError('email')),
        );
    });

    it('should returns 500 if EmailValidator throws', async () => {
        const { sut, emailValidatorStub } = makeSut();
        jest.spyOn(emailValidatorStub, 'isValid').mockImplementationOnce(() => {
            throw new Error();
        });
        const req = {
            body: {
                email: 'any_mail@mail.com',
                password: 'any_password',
            },
        };

        const httpResponse = await sut.handle(req);
        expect(httpResponse.statusCode).toBe(500);
        expect(httpResponse).toEqual(ServerErrorResponse(new Error()));
    });

    it('should returns 200 if valid data is provided', async () => {
        const { sut } = makeSut();
        const req = {
            body: {
                email: 'valid_mail@mail.com',
                password: 'valid_password',
            },
        };

        const httpResponse = await sut.handle(req);
        expect(httpResponse.statusCode).toBe(200);
    });

    it('should calls Authenticate with correct params', async () => {
        const { sut, authenticationStub } = makeSut();
        const authSpy = jest.spyOn(authenticationStub, 'auth');
        const req = {
            body: {
                email: 'any_mail@mail.com',
                password: 'any_password',
            },
        };

        await sut.handle(req);
        expect(authSpy).toHaveBeenCalledWith(
            'any_mail@mail.com',
            'any_password',
        );
    });

    it('should returns 500 if Authenticate throws', async () => {
        const { sut, authenticationStub } = makeSut();
        jest.spyOn(authenticationStub, 'auth').mockImplementationOnce(() => {
            throw new Error();
        });

        const req = {
            body: {
                email: 'any_mail@mail.com',
                password: 'any_password',
            },
        };

        const httpResponse = await sut.handle(req);
        expect(httpResponse.statusCode).toBe(500);
        expect(httpResponse).toEqual(ServerErrorResponse(new Error()));
    });
});
