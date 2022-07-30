import { SignUpController } from './SignUpController';
import { MissingParamError, InvalidParamError, ServerError } from '../Errors';
import { EmailValidator } from '../Protocols/EmailValidator';
import { AddAccount, AddAccountModel } from '../../Domain/useCases/AddAccount';
import { AccountModel } from '../../Domain/Models/Account';

const makeEmailValidatorStub = (): EmailValidator => {
    class EmailValidatorStub implements EmailValidator {
        isValid(email: string): boolean {
            email.toString();
            return true;
        }
    }
    return new EmailValidatorStub();
};

const makeAddAccountStub = (): AddAccount => {
    class AddAccountStub implements AddAccount {
        public async add(accout: AddAccountModel): Promise<AccountModel> {
            return Promise.resolve({
                id: 'valid_id',
                ...accout,
            });
        }
    }
    return new AddAccountStub();
};

interface SutTypes {
    sut: SignUpController;
    emailValidatorStub: EmailValidator;
    addAccountStub: AddAccount;
}

const makeSut = (): SutTypes => {
    const addAccountStub = makeAddAccountStub();
    const emailValidatorStub = makeEmailValidatorStub();
    const sut = new SignUpController(emailValidatorStub, addAccountStub);

    return {
        sut,
        emailValidatorStub,
        addAccountStub,
    };
};

describe('SignUpController', () => {
    it('should return 400 if no name is provided', async () => {
        const { sut } = makeSut();
        const req = {
            body: {
                email: 'any_mail@mail.com',
                password: 'any_password',
                passwordConfirmation: 'any_password',
            },
        };

        const response = await sut.handle(req);

        expect(response.statusCode).toBe(400);
        expect(response.body).toEqual(new MissingParamError('name'));
    });

    it('should return 400 if no mail is provided', async () => {
        const { sut } = makeSut();
        const req = {
            body: {
                name: 'any_name',
                password: 'any_password',
                passwordConfirmation: 'any_password',
            },
        };

        const response = await sut.handle(req);

        expect(response.statusCode).toBe(400);
        expect(response.body).toEqual(new MissingParamError('email'));
    });

    it('should return 400 if no password is provided', async () => {
        const { sut } = makeSut();
        const req = {
            body: {
                name: 'any_name',
                email: 'any_mail@mail.com',
                passwordConfirmation: 'any_password',
            },
        };

        const response = await sut.handle(req);

        expect(response.statusCode).toBe(400);
        expect(response.body).toEqual(new MissingParamError('password'));
    });

    it('should return 400 if no passwordConfirmation is provided', async () => {
        const { sut } = makeSut();
        const req = {
            body: {
                name: 'any_name',
                email: 'any_mail@mail.com',
                password: 'any_password',
            },
        };

        const response = await sut.handle(req);

        expect(response.statusCode).toBe(400);
        expect(response.body).toEqual(
            new MissingParamError('passwordConfirmation'),
        );
    });

    it('should return 400 if passwordConfirmation fails ', async () => {
        const { sut } = makeSut();
        const req = {
            body: {
                name: 'any_name',
                email: 'any_mail@mail.com',
                password: 'any_password',
                passwordConfirmation: 'invlid_password',
            },
        };

        const response = await sut.handle(req);

        expect(response.statusCode).toBe(400);
        expect(response.body).toEqual(
            new InvalidParamError('passwordConfirmation'),
        );
    });

    it('should return 400 if an invalid mail is provided', async () => {
        const { sut, emailValidatorStub } = makeSut();

        jest.spyOn(emailValidatorStub, 'isValid').mockReturnValueOnce(false);

        const req = {
            body: {
                name: 'any_name',
                email: 'ivalid_mail@mail.com',
                password: 'any_password',
                passwordConfirmation: 'any_password',
            },
        };

        const response = await sut.handle(req);

        expect(response.statusCode).toBe(400);
        expect(response.body).toEqual(new InvalidParamError('email'));
    });

    it('should call EmailValidator with correct email', async () => {
        const { sut, emailValidatorStub } = makeSut();

        const isValidSpy = jest.spyOn(emailValidatorStub, 'isValid');

        const email = 'any_mail@mail.com';

        const req = {
            body: {
                name: 'any_name',
                email,
                password: 'any_password',
                passwordConfirmation: 'any_password',
            },
        };

        await sut.handle(req);
        expect(isValidSpy).toHaveBeenCalledWith(email);
    });

    it('should return 500 if EmailValidator throws', async () => {
        const { sut, emailValidatorStub } = makeSut();

        jest.spyOn(emailValidatorStub, 'isValid').mockImplementationOnce(() => {
            throw new Error();
        });

        const req = {
            body: {
                name: 'any_name',
                email: 'any_mail@mail.com',
                password: 'any_password',
                passwordConfirmation: 'any_password',
            },
        };

        const response = await sut.handle(req);

        expect(response.statusCode).toBe(500);
        expect(response.body).toEqual(new ServerError());
    });

    it('should call AddAccount with correct params', async () => {
        const { sut, addAccountStub } = makeSut();

        const addSpy = jest.spyOn(addAccountStub, 'add');

        const req = {
            body: {
                name: 'any_name',
                email: 'any_mail@mail.com',
                password: 'any_password',
                passwordConfirmation: 'any_password',
            },
        };

        const { name, email, password } = req.body;

        await sut.handle(req);

        expect(addSpy).toHaveBeenCalledWith({
            name,
            email,
            password,
        });
    });

    it('should return 500 if AddAccount throws', async () => {
        const { sut, addAccountStub } = makeSut();

        jest.spyOn(addAccountStub, 'add').mockImplementationOnce(() => {
            return Promise.reject(new Error());
        });

        const req = {
            body: {
                name: 'any_name',
                email: 'any_mail@mail.com',
                password: 'any_password',
                passwordConfirmation: 'any_password',
            },
        };

        const response = await sut.handle(req);

        expect(response.statusCode).toBe(500);
        expect(response.body).toEqual(new ServerError());
    });

    it('should return 200 if valid datas provided', async () => {
        const { sut } = makeSut();
        const req = {
            body: {
                name: 'valid_name',
                email: 'valid_mail@mail.com',
                password: 'valid_password',
                passwordConfirmation: 'valid_password',
            },
        };

        const { name, email, password } = req.body;

        const response = await sut.handle(req);

        expect(response.statusCode).toBe(200);
        expect(response.body).toEqual({
            id: 'valid_id',
            name,
            email,
            password,
        });
    });
});
