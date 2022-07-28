import { SignUpController } from './SignUpController';
import { MissingParamError } from '../Errors/MissingParam';

const makeSut = () => {
    return new SignUpController();
};

describe('SignUpController', () => {
    it('should return 400 if no name is provided', () => {
        const stu = makeSut();
        const req = {
            body: {
                email: 'any_mail@mail.com',
                password: 'any_password',
            },
        };

        const response = stu.handle(req);

        expect(response.statusCode).toBe(400);
        expect(response.body).toEqual(new MissingParamError('name'));
    });

    it('should return 400 if no mail is provided', () => {
        const stu = makeSut();
        const req = {
            body: {
                name: 'any_name',
                password: 'any_password',
            },
        };

        const response = stu.handle(req);

        expect(response.statusCode).toBe(400);
        expect(response.body).toEqual(new MissingParamError('email'));
    });

    it('should return 400 if no password is provided', () => {
        const stu = makeSut();
        const req = {
            body: {
                name: 'any_name',
                email: 'any_mail@mail.com',
            },
        };

        const response = stu.handle(req);

        expect(response.statusCode).toBe(400);
        expect(response.body).toEqual(new MissingParamError('password'));
    });

    it('should return 400 if no passwordConfirmation is provided', () => {
        const stu = makeSut();
        const req = {
            body: {
                name: 'any_name',
                email: 'any_mail@mail.com',
                password: 'any_password',
            },
        };

        const response = stu.handle(req);

        expect(response.statusCode).toBe(400);
        expect(response.body).toEqual(
            new MissingParamError('passwordConfirmation'),
        );
    });
});
