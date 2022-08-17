import { Validation } from './Validation';
import { InvalidParamError } from '../../Errors';

export class CompareFieldsValidator implements Validation {
    constructor(
        private readonly fieldName: string,
        private readonly fieldToCompareName: string,
    ) {}

    validate(input: any): Error | null {
        if (input[this.fieldName] !== input[this.fieldToCompareName]) {
            return new InvalidParamError(this.fieldToCompareName);
        }

        return null;
    }
}
