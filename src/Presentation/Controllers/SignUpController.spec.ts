import { SignUpController } from './SignUpController';
import { MissingParam } from '../Errors/MissingParam';

describe('SignUpController', () => {
    it('should return 400 if no name is provided', () => {
        const stu = new SignUpController();
        const req = {
            body: {
                email: 'any_mail@mail.com',
                password: 'any_password',
            },
        };

        const response = stu.handle(req);

        expect(response.statusCode).toBe(400);
        expect(response.body).toEqual(new MissingParam('name'));
    });

    it('should return 400 if no mail is provided', () => {
        const stu = new SignUpController();
        const req = {
            body: {
                name: 'any_name',
                password: 'any_password',
            },
        };

        const response = stu.handle(req);

        expect(response.statusCode).toBe(400);
        expect(response.body).toEqual(new MissingParam('email'));
    });
});
