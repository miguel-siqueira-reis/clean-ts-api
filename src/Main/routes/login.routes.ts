import { Router } from 'express';
import { adapterRouter } from '../adapters/express/expressAdapterRouter';
import { makeSignUpController } from '../factories/singUp/singUpFactory';
import { makeLoginController } from '../factories/login/loginFactory';

export default (router: Router): void => {
    router.post('/signup', adapterRouter(makeSignUpController()));
    router.post('/login', adapterRouter(makeLoginController()));
};
