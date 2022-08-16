import { InvalidParamError, MissingParamError } from '../Errors';
import { LoginController } from './LoginController';
import { BadRequest, ServerErrorResponse } from '../Helpers/HttpHelper';
import { EmailValidator } from '../Protocols/EmailValidator';

const makeEmailValidatorStub = (): EmailValidator => {
    class EmailValidatorStub implements EmailValidator {
        isValid(email: string): boolean {
            email.toString();
            return true;
        }
    }
    return new EmailValidatorStub();
};

interface SutTypes {
    sut: LoginController;
    emailValidatorStub: EmailValidator;
}
const makeSut = (): SutTypes => {
    const emailValidatorStub = makeEmailValidatorStub();
    const sut = new LoginController(emailValidatorStub);
    return { sut, emailValidatorStub };
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

    it('should calls EmailValidator with Correct Params', async () => {
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
});
