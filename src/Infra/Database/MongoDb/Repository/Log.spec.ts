import { Collection } from 'mongodb';
import { MongoHelper } from '../Helpers/MongoHelper';
import { LogRepository } from './Log';

describe('Log Repository', () => {
    let errorCollection: Collection;

    beforeAll(async () => {
        await MongoHelper.connect(process.env.MONGO_URL);
    });

    afterAll(async () => {
        await MongoHelper.disconnect();
    });

    beforeEach(async () => {
        errorCollection = await MongoHelper.getCollection('errors');
        await errorCollection.deleteMany({});
    });

    it('should create error log on success', async () => {
        const sut = new LogRepository();
        await sut.logError('any_error');
        const count = await errorCollection.countDocuments();
        expect(count).toBe(1);
    });
});
