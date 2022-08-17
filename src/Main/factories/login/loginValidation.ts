import { ValidationComposite } from '../../../Presentation/Helpers/Validators/ValidationComposite';
import { RequiredFieldValidation } from '../../../Presentation/Helpers/Validators/RequiredFieldValidation';
import { Validation } from '../../../Presentation/Helpers/Validators/Validation';
import { EmailValidatorAdapter } from '../../../Utils/EmailValidatorAdapter';
import { EmailValidation } from '../../../Presentation/Helpers/Validators/EmailValidation';

export const makeLoginValidation = (): Validation => {
    return new ValidationComposite([
        new RequiredFieldValidation('email', 'password'),

        new EmailValidation('email', new EmailValidatorAdapter()),
    ]);
};
