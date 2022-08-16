import { MissingParamError } from '../Errors';
import { LoginController } from './LoginController';
import { BadRequest } from '../Helpers/HttpHelper';

interface SutTypes {
    sut: LoginController;
}

const makeSut = (): SutTypes => {
    const sut = new LoginController();
    return { sut };
};

describe('LoginController', () => {
    it('should return 400 if no email is provided', async () => {
        const { sut } = makeSut();
        const req = {
            body: {
                password: 'any_password',
            },
        };

        const httpResponse = await sut.handle(req);
        expect(httpResponse.statusCode).toBe(400);
        expect(httpResponse).toEqual(
            BadRequest(new MissingParamError('email')),
        );
    });

    it('should return 400 if no password is provided', async () => {
        const { sut } = makeSut();
        const req = {
            body: {
                email: 'any_mail@mail.com',
            },
        };

        const httpResponse = await sut.handle(req);
        expect(httpResponse.statusCode).toBe(400);
        expect(httpResponse).toEqual(
            BadRequest(new MissingParamError('password')),
        );
    });

    it('should returns 200 if valid data is provided', async () => {
        const { sut } = makeSut();
        const req = {
            body: {
                email: 'valid_mail@mail.com',
                password: 'valid_password',
            },
        };

        const httpResponse = await sut.handle(req);
        expect(httpResponse.statusCode).toBe(200);
    });
});
