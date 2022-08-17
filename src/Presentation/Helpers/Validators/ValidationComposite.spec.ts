import { ValidationComposite } from './ValidationComposite';
import { MissingParamError } from '../../Errors';
import { Validation } from './Validation';

const makeValidationStub = (): Validation => {
    class ValidationStub implements Validation {
        validate(input: any): Error | null {
            return null;
        }
    }
    return new ValidationStub();
};

interface SutTypes {
    sut: ValidationComposite;
    validationStub: Validation;
}
const makeSut = (): SutTypes => {
    const validationStub = makeValidationStub();
    const sut = new ValidationComposite([validationStub]);
    return {
        sut,
        validationStub,
    };
};

describe('ValidationComposite', () => {
    it('should return an error if any validation fails', () => {
        const { sut, validationStub } = makeSut();
        jest.spyOn(validationStub, 'validate').mockReturnValueOnce(
            new MissingParamError('any_field'),
        );
        const error = sut.validate({ any_field: 'any_value' });
        expect(error).toEqual(new MissingParamError('any_field'));
    });
});
