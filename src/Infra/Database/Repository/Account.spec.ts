import { AccountRepository } from './Account';
import { MongoHelper } from '../Helpers/MongoHelper';

describe('Account mongo Repository', () => {
    beforeAll(async () => {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        // eslint-disable-next-line no-underscore-dangle
        await MongoHelper.connect(process.env.MONGO_URL);
    });

    afterAll(async () => {
        await MongoHelper.disconnect();
    });

    beforeEach(async () => {
        const accountCollection = MongoHelper.getCollection('accounts');
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
});
