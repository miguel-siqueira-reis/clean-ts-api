import { makeSignUpValidation } from './singUpValidation';
import {
    ValidationComposite,
    CompareFieldsValidation,
    RequiredFieldValidation,
    EmailValidation,
} from '../../../Presentation/Helpers/Validators';
import { EmailValidator } from '../../../Presentation/Protocols/EmailValidator';

jest.mock('../../../Presentation/Helpers/Validators/ValidationComposite');

const makeEmailValidatorStub = (): EmailValidator => {
    class EmailValidatorStub implements EmailValidator {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        isValid(email: string): boolean {
            return true;
        }
    }
    return new EmailValidatorStub();
};

describe('SignUpValidationFactory', () => {
    it('should call validationComposite with all validations', () => {
        makeSignUpValidation();

        const validations = [];

        validations.push(
            new RequiredFieldValidation(
                'name',
                'email',
                'password',
                'passwordConfirmation',
            ),
        );

        validations.push(
            new CompareFieldsValidation('password', 'passwordConfirmation'),
        );

        validations.push(
            new EmailValidation('email', makeEmailValidatorStub()),
        );

        expect(ValidationComposite).toHaveBeenCalledWith(validations);
    });
});
