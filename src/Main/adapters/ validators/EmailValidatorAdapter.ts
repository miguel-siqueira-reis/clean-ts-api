import validator from 'validator';
import { EmailValidator } from '../../../Presentation/Protocols/EmailValidator';

export class EmailValidatorAdapter implements EmailValidator {
    isValid(email: string): boolean {
        return validator.isEmail(email);
    }
}
