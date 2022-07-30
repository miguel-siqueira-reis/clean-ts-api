import { EmailValidatorAdapter } from './EmailValidator';

describe('EmailValidator', () => {
    it('should return false if validator returns false', function () {
        const sut = new EmailValidatorAdapter();
        const isValid = sut.isValid('invalid_mail@mail.com');

        expect(isValid).toBe(false);
    });
});
