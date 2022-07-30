// eslint-disable-next-line @typescript-eslint/no-unused-vars
import validator from 'validator';
import { EmailValidatorAdapter } from './EmailValidator';

jest.mock('validator', () => ({
    isEmail: jest.fn(() => true),
}));

describe('EmailValidator', () => {
    it('should return false if validator returns false', () => {
        const sut = new EmailValidatorAdapter();

        jest.spyOn(validator, 'isEmail').mockReturnValueOnce(false);
        const isValid = sut.isValid('invalid_mail@mail.com');

        expect(isValid).toBe(false);
    });

    it('should return true if validator returns true', () => {
        const sut = new EmailValidatorAdapter();
        const isValid = sut.isValid('valid_mail@mail.com');

        expect(isValid).toBe(true);
    });

    it('should call validator with correct email param ', () => {
        const sut = new EmailValidatorAdapter();
        const email = 'any_mail@mail.com';
        sut.isValid(email);
        const isValidSpy = jest.spyOn(validator, 'isEmail');

        expect(isValidSpy).toHaveBeenCalledWith(email);
    });
});
