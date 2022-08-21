// eslint-disable-next-line import/no-extraneous-dependencies
import request from 'supertest';
import 'dotenv/config';
import { Collection } from 'mongodb';
import { hash } from 'bcrypt';
import app from '../config/app';
import { MongoHelper } from '../../Infra/Database/MongoDb/Helpers/MongoHelper';

let accountCollection: Collection;

describe('Login Routes', () => {
    beforeAll(async () => {
        await MongoHelper.connect(process.env.MONGO_URL);
    });

    afterAll(async () => {
        await MongoHelper.disconnect();
    });

    beforeEach(async () => {
        accountCollection = await MongoHelper.getCollection('accounts');
        await accountCollection.deleteMany({});
    });

    describe('POST /signup', () => {
        it('should return 200 an account on success on signup router', async () => {
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

    describe('POST /login', () => {
        it('should return 200 an token on success on login router', async () => {
            const password = await hash('any_password', 12);

            await accountCollection.insertOne({
                name: 'any_name',
                email: 'any_mail@mail.com',
                password,
            });

            await request(app)
                .post('/api/login')
                .send({
                    email: 'any_mail@mail.com',
                    password: 'any_password',
                })
                .expect(200);
        });

        it('should return 401 on login router', async () => {
            await request(app)
                .post('/api/login')
                .send({
                    email: 'any_mail@mail.com',
                    password: 'any_password',
                })
                .expect(401);
        });
    });
});
