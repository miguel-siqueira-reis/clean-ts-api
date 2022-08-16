import { SignUpController } from './SignUpController';
import { MissingParamError, InvalidParamError, ServerError } from '../Errors';
import { EmailValidator } from '../Protocols/EmailValidator';
import { AddAccount, AddAccountModel } from '../../Domain/useCases/AddAccount';
import { AccountModel } from '../../Domain/Models/Account';
import { HttpRequest } from '../Protocols';
import { Validation } from '../Helpers/Validators/Validation';
import { BadRequest } from '../Helpers/HttpHelper';

const makeValidationStub = (): Validation => {
    class ValidationStub implements Validation {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        validate(input: any): Error | null {
            return null;
        }
    }
    return new ValidationStub();
};

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
    validationStub: Validation;
}

const makeSut = (): SutTypes => {
    const validationStub = makeValidationStub();
    const addAccountStub = makeAddAccountStub();
    const emailValidatorStub = makeEmailValidatorStub();
    const sut = new SignUpController(
        emailValidatorStub,
        addAccountStub,
        validationStub,
    );

    return {
        sut,
        emailValidatorStub,
        addAccountStub,
        validationStub,
    };
};

const makeFakeAccount = (): AccountModel => ({
    id: 'valid_id',
    name: 'any_name',
    email: 'any_mail@mail.com',
    password: 'any_password',
});

const makeFakeRequest = (): HttpRequest => ({
    body: {
        name: 'any_name',
        email: 'any_mail@mail.com',
        password: 'any_password',
        passwordConfirmation: 'any_password',
    },
});

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
        const req = makeFakeRequest();

        const response = await sut.handle(req);

        expect(response.statusCode).toBe(400);
        expect(response.body).toEqual(new InvalidParamError('email'));
    });

    it('should call EmailValidator with correct email', async () => {
        const { sut, emailValidatorStub } = makeSut();

        const isValidSpy = jest.spyOn(emailValidatorStub, 'isValid');
        const req = makeFakeRequest();

        await sut.handle(req);
        expect(isValidSpy).toHaveBeenCalledWith('any_mail@mail.com');
    });

    it('should return 500 if EmailValidator throws', async () => {
        const { sut, emailValidatorStub } = makeSut();

        jest.spyOn(emailValidatorStub, 'isValid').mockImplementationOnce(() => {
            throw new Error();
        });

        const req = makeFakeRequest();
        const response = await sut.handle(req);

        expect(response.statusCode).toBe(500);
        expect(response.body).toEqual(new ServerError());
    });

    it('should call AddAccount with correct params', async () => {
        const { sut, addAccountStub } = makeSut();

        const addSpy = jest.spyOn(addAccountStub, 'add');

        const req = makeFakeRequest();
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

        const req = makeFakeRequest();
        const response = await sut.handle(req);

        expect(response.statusCode).toBe(500);
        expect(response.body).toEqual(new ServerError());
    });

    it('should return 200 if valid datas provided', async () => {
        const { sut } = makeSut();

        const req = makeFakeRequest();
        const response = await sut.handle(req);

        expect(response.statusCode).toBe(200);
        expect(response.body).toEqual(makeFakeAccount());
    });

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
});
