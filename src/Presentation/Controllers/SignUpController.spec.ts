import { SignUpController } from './SignUpController';
import { MissingParamError, InvalidParamError, ServerError } from '../Errors';
import { EmailValidator } from '../Protocols';

interface SutTypes {
    sut: SignUpController;
    emailValidatorStub: EmailValidator;
}

const makeEmailValidatorStub = (): EmailValidator => {
    class EmailValidatorStub implements EmailValidator {
        isValid(email: string): boolean {
            return true;
        }
    }
    return new EmailValidatorStub();
};

const makeSut = (): SutTypes => {
    const emailValidatorStub = makeEmailValidatorStub();
    const sut = new SignUpController(emailValidatorStub);

    return {
        sut,
        emailValidatorStub,
    };
};

describe('SignUpController', () => {
    it('should return 400 if no name is provided', () => {
        const { sut } = makeSut();
        const req = {
            body: {
                email: 'any_mail@mail.com',
                password: 'any_password',
                passwordConfirmation: 'any_passwordConfirmation',
            },
        };

        const response = sut.handle(req);

        expect(response.statusCode).toBe(400);
        expect(response.body).toEqual(new MissingParamError('name'));
    });

    it('should return 400 if no mail is provided', () => {
        const { sut } = makeSut();
        const req = {
            body: {
                name: 'any_name',
                password: 'any_password',
                passwordConfirmation: 'any_passwordConfirmation',
            },
        };

        const response = sut.handle(req);

        expect(response.statusCode).toBe(400);
        expect(response.body).toEqual(new MissingParamError('email'));
    });

    it('should return 400 if no password is provided', () => {
        const { sut } = makeSut();
        const req = {
            body: {
                name: 'any_name',
                email: 'any_mail@mail.com',
                passwordConfirmation: 'any_passwordConfirmation',
            },
        };

        const response = sut.handle(req);

        expect(response.statusCode).toBe(400);
        expect(response.body).toEqual(new MissingParamError('password'));
    });

    it('should return 400 if no passwordConfirmation is provided', () => {
        const { sut } = makeSut();
        const req = {
            body: {
                name: 'any_name',
                email: 'any_mail@mail.com',
                password: 'any_password',
            },
        };

        const response = sut.handle(req);

        expect(response.statusCode).toBe(400);
        expect(response.body).toEqual(
            new MissingParamError('passwordConfirmation'),
        );
    });

    it('should return 400 if an invalid mail is provided', () => {
        const { sut, emailValidatorStub } = makeSut();

        jest.spyOn(emailValidatorStub, 'isValid').mockReturnValueOnce(false);

        const req = {
            body: {
                name: 'any_name',
                email: 'ivalid_mail@mail.com',
                password: 'any_password',
                passwordConfirmation: 'any_passwordConfirmation',
            },
        };

        const response = sut.handle(req);

        expect(response.statusCode).toBe(400);
        expect(response.body).toEqual(new InvalidParamError('email'));
    });

    it('should call EmailValidator with correct email', () => {
        const { sut, emailValidatorStub } = makeSut();

        const isValidSpy = jest.spyOn(emailValidatorStub, 'isValid');

        const email = 'any_mail@mail.com';

        const req = {
            body: {
                name: 'any_name',
                email,
                password: 'any_password',
                passwordConfirmation: 'any_passwordConfirmation',
            },
        };

        sut.handle(req);
        expect(isValidSpy).toHaveBeenCalledWith(email);
    });

    it('should return 500 if EmailValidator throws', () => {
        const { sut, emailValidatorStub } = makeSut();

        jest.spyOn(emailValidatorStub, 'isValid').mockImplementationOnce(() => {
            throw new Error();
        });

        const req = {
            body: {
                name: 'any_name',
                email: 'any_mail@mail.com',
                password: 'any_password',
                passwordConfirmation: 'any_passwordConfirmation',
            },
        };

        const response = sut.handle(req);

        expect(response.statusCode).toBe(500);
        expect(response.body).toEqual(new ServerError());
    });
});
