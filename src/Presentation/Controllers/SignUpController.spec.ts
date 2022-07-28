import { SignUpController } from './SignUpController';
import { MissingParamError } from '../Errors/MissingParam';
import { InvalidParamError } from '../Errors/InvalidParam';
import { EmailValidator } from '../Protocols/EmailValidator';

interface SutTypes {
    sut: SignUpController;
    emailValidatorStub: EmailValidator;
}

const makeSut = (): SutTypes => {
    class EmailValidatorStub implements EmailValidator {
        isValid(email: string): boolean {
            return true;
        }
    }
    const emailValidatorStub = new EmailValidatorStub();
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
});
