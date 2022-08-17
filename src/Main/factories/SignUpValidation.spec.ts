import { makeSignUpValidation } from './singUpValidation';
import { ValidationComposite } from '../../Presentation/Helpers/Validators/ValidationComposite';
import { RequiredFieldValidation } from '../../Presentation/Helpers/Validators/RequiredFieldValidation';
import { CompareFieldsValidator } from '../../Presentation/Helpers/Validators/CompareFieldsValidator';

jest.mock('../../Presentation/Helpers/Validators/ValidationComposite');

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
            new CompareFieldsValidator('password', 'passwordConfirmation'),
        );

        expect(ValidationComposite).toHaveBeenCalledWith(validations);
    });
});
