import { Collection } from 'mongodb';
import { AccountRepository } from './Account';
import { MongoHelper } from '../Helpers/MongoHelper';

let accountCollection: Collection;

describe('Account mongo Repository', () => {
    beforeAll(async () => {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        await MongoHelper.connect(process.env.MONGO_URL);
    });

    afterAll(async () => {
        await MongoHelper.disconnect();
    });

    beforeEach(async () => {
        accountCollection = await MongoHelper.getCollection('accounts');
        await accountCollection.deleteMany({});
    });

    it('should return Account on success', async () => {
        const sut = new AccountRepository();
        const data = {
            name: 'any_name',
            email: 'any_mail@mail.com',
            password: 'any_password',
        };
        const account = await sut.add(data);

        expect(account).toBeTruthy();
        expect(account.id).toBeTruthy();
        expect(account.name).toBe(data.name);
        expect(account.email).toBe(data.email);
        expect(account.password).toBe(data.password);
    });

    it('should return an account on loadByEmail success', async () => {
        const sut = new AccountRepository();
        const data = {
            name: 'any_name',
            email: 'any_mail@mail.com',
            password: 'any_password',
        };
        await accountCollection.insertOne(data);
        const account = await sut.loadByEmail('any_mail@mail.com');

        expect(account).toBeTruthy();
        expect(account?.id).toBeTruthy();
        expect(account?.name).toBe(data.name);
        expect(account?.email).toBe(data.email);
        expect(account?.password).toBe(data.password);
    });
});
