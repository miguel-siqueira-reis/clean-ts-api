import { RequiredFieldValidation } from './RequiredFieldValidation';
import { MissingParamError } from '../../Errors';

describe('RequiredFieldValidation', () => {
    it('should return missing params errror if validation fails', () => {
        const sut = new RequiredFieldValidation('any_field');
        const error = sut.validate({ other_field: 'any_value' });
        expect(error).toEqual(new MissingParamError('any_field'));
    });
});
