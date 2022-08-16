// eslint-disable-next-line import/no-extraneous-dependencies
import request from 'supertest';
import app from '../config/app';
import { MongoHelper } from '../../Infra/Database/MongoDb/Helpers/MongoHelper';

describe('SignUp', () => {
    beforeAll(async () => {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        await MongoHelper.connect(process.env.MONGO_URL);
    });

    afterAll(async () => {
        await MongoHelper.disconnect();
    });

    beforeEach(async () => {
        const accountCollection = await MongoHelper.getCollection('accounts');
        await accountCollection.deleteMany({});
    });

    it('should return an account on success', async () => {
        await request(app)
            .post('/api/signup')
            .send({
                name: 'any_name',
                email: 'any_mail@mail.com',
                password: 'any_password',
                passwordConfirmation: 'any_password',
            })
            .expect(200);
    });
});
