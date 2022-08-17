import { CompareFieldsValidation } from './CompareFieldsValidation';
import { InvalidParamError } from '../../Errors';

describe('CompareFieldsValidation', () => {
    it('should return Invalid param errror if validation fails', () => {
        const sut = new CompareFieldsValidation('any_field', 'compare_field');
        const error = sut.validate({
            any_field: 'any_value',
            compare_field: 'other_value',
        });
        expect(error).toEqual(new InvalidParamError('compare_field'));
    });

    it('should not return missing params errror if validate no fails', () => {
        const sut = new CompareFieldsValidation('any_field', 'compare_field');
        const error = sut.validate({
            any_field: 'same_value',
            compare_field: 'same_value',
        });
        expect(error).toBeFalsy();
    });
});
