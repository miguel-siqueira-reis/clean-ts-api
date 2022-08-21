import { LoginController } from '../../../Presentation/Controllers/Login/LoginController';
import { Controller } from '../../../Presentation/Protocols';
import { LogControllerDecorator } from '../../decorators/LogDecorator';
import { LogRepository } from '../../../Infra/Database/MongoDb/Repository/Log/LogRepository';
import { makeLoginValidation } from './loginValidation';
import { DbAuthentication } from '../../../Data/UseCases/Authentication/DbAuthentication';
import { AccountRepository } from '../../../Infra/Database/MongoDb/Repository/Account/AccountRepository';
import { BcryptAdapter } from '../../../Infra/Criptography/BcryptAdapter/BcryptAdapter';
import { JwtAdatper } from '../../../Infra/Criptography/JwtAdapter/JwtAdatper';

export const makeLoginFactory = (): Controller => {
    const accountRepository = new AccountRepository();
    const hashComparer = new BcryptAdapter(12);
    const encrypter = new JwtAdatper(process.env.JWT_SECRET as string);

    const authentication = new DbAuthentication(
        accountRepository,
        hashComparer,
        encrypter,
        accountRepository,
    );

    const loginController = new LoginController(
        authentication,
        makeLoginValidation(),
    );

    return new LogControllerDecorator(loginController, new LogRepository());
};
