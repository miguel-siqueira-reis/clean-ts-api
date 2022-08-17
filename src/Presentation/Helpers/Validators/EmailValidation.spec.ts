import { EmailValidator } from '../../Protocols/EmailValidator';
import { EmailValidation } from './EmailValidation';
import { Validation } from './Validation';
import { InvalidParamError, MissingParamError } from '../../Errors';

const makeEmailValidatorStub = (): EmailValidator => {
    class EmailValidatorStub implements EmailValidator {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        isValid(email: string): boolean {
            return true;
        }
    }
    return new EmailValidatorStub();
};

interface SutTypes {
    sut: Validation;
    emailValidatorStub: EmailValidator;
}
const makeSut = (): SutTypes => {
    const emailValidatorStub = makeEmailValidatorStub();
    const sut = new EmailValidation('email', emailValidatorStub);

    return {
        sut,
        emailValidatorStub,
    };
};

describe('EmailValidation', () => {
    it('should return error invalid param error if an invalid mail is provided', async () => {
        const { sut, emailValidatorStub } = makeSut();

        jest.spyOn(emailValidatorStub, 'isValid').mockReturnValueOnce(false);

        const response = await sut.validate({
            email: 'invalid_mail@mail.com',
        });

        expect(response).toEqual(new InvalidParamError('email'));
    });

    it('should call EmailValidator with correct email', async () => {
        const { sut, emailValidatorStub } = makeSut();

        const isValidSpy = jest.spyOn(emailValidatorStub, 'isValid');

        await sut.validate({
            email: 'any_mail@mail.com',
        });

        expect(isValidSpy).toHaveBeenCalledWith('any_mail@mail.com');
    });

    it('should return 500 if EmailValidator throws', async () => {
        const { sut, emailValidatorStub } = makeSut();

        jest.spyOn(emailValidatorStub, 'isValid').mockImplementationOnce(() => {
            throw new Error();
        });

        await expect(sut.validate).toThrow();
    });
});
