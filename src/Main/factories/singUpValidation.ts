import { ValidationComposite } from '../../Presentation/Helpers/Validators/ValidationComposite';
import { RequiredFieldValidation } from '../../Presentation/Helpers/Validators/RequiredFieldValidation';
import { Validation } from '../../Presentation/Helpers/Validators/Validation';

export const makeSignUpValidation = (): Validation => {
    return new ValidationComposite([
        new RequiredFieldValidation(
            'name',
            'email',
            'password',
            'passwordConfirmation',
        ),
    ]);
};
