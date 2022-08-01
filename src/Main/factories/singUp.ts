import { SignUpController } from '../../Presentation/Controllers/SignUpController';
import { EmailValidatorAdapter } from '../../Utils/EmailValidatorAdapter';
import { DbAddAccount } from '../../Data/UseCases/DbAddAccount/DbAddAccount';
import { BcryptAdapter } from '../../Infra/Criptography/BcryptAdapter';
import { AccountRepository } from '../../Infra/Database/Repository/Account';

export const makeSinUpController = (): SignUpController => {
    const addAccount = new DbAddAccount(
        new BcryptAdapter(12),
        new AccountRepository(),
    );
    return new SignUpController(new EmailValidatorAdapter(), addAccount);
};
