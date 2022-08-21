import { SignUpController } from '../../../Presentation/Controllers/SingUp/SignUpController';
import { DbAddAccount } from '../../../Data/UseCases/DbAddAccount/DbAddAccount';
import { BcryptAdapter } from '../../../Infra/Criptography/BcryptAdapter/BcryptAdapter';
import { AccountRepository } from '../../../Infra/Database/MongoDb/Repository/Account/AccountRepository';
import { Controller } from '../../../Presentation/Protocols';
import { LogControllerDecorator } from '../../decorators/LogDecorator';
import { LogRepository } from '../../../Infra/Database/MongoDb/Repository/Log/LogRepository';
import { makeSignUpValidation } from './singUpValidation';

export const makeSignUpController = (): Controller => {
    const addAccount = new DbAddAccount(
        new BcryptAdapter(12),
        new AccountRepository(),
    );
    const signUpController = new SignUpController(
        addAccount,
        makeSignUpValidation(),
    );

    return new LogControllerDecorator(signUpController, new LogRepository());
};
