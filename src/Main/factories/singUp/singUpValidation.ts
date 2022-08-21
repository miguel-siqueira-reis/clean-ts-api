import {
    ValidationComposite,
    CompareFieldsValidation,
    RequiredFieldValidation,
    EmailValidation,
} from '../../../Presentation/Helpers/Validators';
import { Validation } from '../../../Presentation/Protocols/Validation';
import { EmailValidatorAdapter } from '../../adapters/ validators/EmailValidatorAdapter';

export const makeSignUpValidation = (): Validation => {
    return new ValidationComposite([
        new RequiredFieldValidation(
            'name',
            'email',
            'password',
            'passwordConfirmation',
        ),

        new CompareFieldsValidation('password', 'passwordConfirmation'),

        new EmailValidation('email', new EmailValidatorAdapter()),
    ]);
};
