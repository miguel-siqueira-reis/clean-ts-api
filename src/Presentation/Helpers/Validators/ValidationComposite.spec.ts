import { ValidationComposite } from './ValidationComposite';
import { InvalidParamError, MissingParamError } from '../../Errors';
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
    validationStubs: Validation[];
}
const makeSut = (): SutTypes => {
    const validationStub = makeValidationStub();
    const validationStub2 = makeValidationStub();
    const sut = new ValidationComposite([validationStub, validationStub2]);
    return {
        sut,
        validationStubs: [validationStub, validationStub2],
    };
};

describe('ValidationComposite', () => {
    it('should return an error if any validation fails', () => {
        const { sut, validationStubs } = makeSut();
        jest.spyOn(validationStubs[0], 'validate').mockReturnValueOnce(
            new MissingParamError('any_field'),
        );
        const error = sut.validate({ any_field: 'any_value' });
        expect(error).toEqual(new MissingParamError('any_field'));
    });

    it('should return the first error  if more one validation fails', () => {
        const { sut, validationStubs } = makeSut();
        jest.spyOn(validationStubs[0], 'validate').mockReturnValueOnce(
            new InvalidParamError('any_field'),
        );
        jest.spyOn(validationStubs[0], 'validate').mockReturnValueOnce(
            new MissingParamError('any_field'),
        );
        const error = sut.validate({ any_field: 'any_value' });
        expect(error).toEqual(new InvalidParamError('any_field'));
    });
});
