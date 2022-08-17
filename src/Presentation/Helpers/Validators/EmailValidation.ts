import { Validation } from './Validation';
import { EmailValidator } from '../../Protocols/EmailValidator';
import { InvalidParamError } from '../../Errors';

export class EmailValidation implements Validation {
    private readonly fieldName: string;

    private readonly emailValidator: EmailValidator;

    constructor(fieldName: string, emailValidator: EmailValidator) {
        this.fieldName = fieldName;
        this.emailValidator = emailValidator;
    }

    validate(input: any): Error | null {
        const isEmailValid = this.emailValidator.isValid(input[this.fieldName]);
        if (!isEmailValid) {
            return new InvalidParamError(this.fieldName);
        }
        return null;
    }
}
