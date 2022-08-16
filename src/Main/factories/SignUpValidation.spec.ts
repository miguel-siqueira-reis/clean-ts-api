import { makeSignUpValidation } from './singUpValidation';
import { ValidationComposite } from '../../Presentation/Helpers/Validators/ValidationComposite';
import { RequiredFieldValidation } from '../../Presentation/Helpers/Validators/RequiredFieldValidation';

jest.mock('../../Presentation/Helpers/Validators/ValidationComposite');

describe('SignUpValidationFactory', () => {
    it('should call validationComposite with all validations', () => {
        makeSignUpValidation();
        expect(ValidationComposite).toHaveBeenCalledWith([
            new RequiredFieldValidation(
                'name',
                'email',
                'password',
                'passwordConfirmation',
            ),
        ]);
    });
});
