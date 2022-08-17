import {
    ValidationComposite,
    RequiredFieldValidation,
    EmailValidation,
} from '../../../Presentation/Helpers/Validators';
import { Validation } from '../../../Presentation/Protocols/Validation';
import { EmailValidatorAdapter } from '../../../Utils/EmailValidatorAdapter';

export const makeLoginValidation = (): Validation => {
    return new ValidationComposite([
        new RequiredFieldValidation('email', 'password'),

        new EmailValidation('email', new EmailValidatorAdapter()),
    ]);
};
