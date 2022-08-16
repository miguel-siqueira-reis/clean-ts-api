import { SignUpController } from '../../Presentation/Controllers/SignUpController';
import { EmailValidatorAdapter } from '../../Utils/EmailValidatorAdapter';
import { DbAddAccount } from '../../Data/UseCases/DbAddAccount/DbAddAccount';
import { BcryptAdapter } from '../../Infra/Criptography/BcryptAdapter';
import { AccountRepository } from '../../Infra/Database/Repository/Account';
import { Controller } from '../../Presentation/Protocols';
import { LogControllerDecorator } from '../decorators/Log';

export const makeSignUpController = (): Controller => {
    const addAccount = new DbAddAccount(
        new BcryptAdapter(12),
        new AccountRepository(),
    );
    const signUpController = new SignUpController(
        new EmailValidatorAdapter(),
        addAccount,
    );

    return new LogControllerDecorator(signUpController);
};
