import {
    ValidationComposite,
    RequiredFieldValidation,
    EmailValidation,
} from '../../../Presentation/Helpers/Validators';
import { Validation } from '../../../Presentation/Protocols/Validation';
import { EmailValidatorAdapter } from '../../adapters/ validators/EmailValidatorAdapter';

export const makeLoginValidation = (): Validation => {
    return new ValidationComposite([
        new RequiredFieldValidation('email', 'password'),

        new EmailValidation('email', new EmailValidatorAdapter()),
    ]);
};
