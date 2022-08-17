import { makeLoginValidation } from './loginValidation';
import {
    ValidationComposite,
    EmailValidation,
    RequiredFieldValidation,
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

describe('loginValidationFactory', () => {
    it('should call validationComposite with all validations', () => {
        makeLoginValidation();

        const validations = [];

        validations.push(new RequiredFieldValidation('email', 'password'));

        validations.push(
            new EmailValidation('email', makeEmailValidatorStub()),
        );

        expect(ValidationComposite).toHaveBeenCalledWith(validations);
    });
});
