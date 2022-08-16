import { Validation } from './Validation';
import { MissingParamError } from '../../Errors';

export class RequiredFieldValidation implements Validation {
    private readonly fieldsName: string[];

    constructor(...fieldsName: string[]) {
        this.fieldsName = fieldsName;
    }

    validate(input: any): Error | null {
        for (const field of this.fieldsName) {
            if (!input[field]) {
                return new MissingParamError(field);
            }
        }
        return null;
    }
}
