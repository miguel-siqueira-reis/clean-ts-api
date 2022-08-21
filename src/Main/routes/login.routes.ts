import { Router } from 'express';
import { adapterRouter } from '../adapters/express/expressAdapterRouter';
import { makeSignUpController } from '../factories/singUp/singUpFactory';

export default (router: Router): void => {
    router.post('/signup', adapterRouter(makeSignUpController()));
};
