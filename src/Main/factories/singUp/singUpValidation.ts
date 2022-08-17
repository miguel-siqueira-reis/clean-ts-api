import { ValidationComposite } from '../../../Presentation/Helpers/Validators/ValidationComposite';
import { RequiredFieldValidation } from '../../../Presentation/Helpers/Validators/RequiredFieldValidation';
import { Validation } from '../../../Presentation/Protocols/Validation';
import { CompareFieldsValidation } from '../../../Presentation/Helpers/Validators/CompareFieldsValidation';
import { EmailValidatorAdapter } from '../../../Utils/EmailValidatorAdapter';
import { EmailValidation } from '../../../Presentation/Helpers/Validators/EmailValidation';

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
