import { SignUpController } from './SignUpController';

describe('SignUpController', () => {
    it('should return 400 if no name is provided', function () {
        const stu = new SignUpController();
        const req = {
            body: {
                email: 'any_mail@mail.com',
                password: 'any_password',
            },
        };

        const response = stu.handle(req);

        expect(response.statusCode).toBe(400);
        expect(response.body).toEqual(new Error('Name is required'));
    });
});
