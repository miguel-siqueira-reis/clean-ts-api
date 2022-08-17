import { Router } from 'express';
import { adapterRouter } from '../adapters/expressAdapterRouter';
import { makeSignUpController } from '../factories/singUp/singUp';

export default (router: Router): void => {
    router.post('/signup', adapterRouter(makeSignUpController()));
};
