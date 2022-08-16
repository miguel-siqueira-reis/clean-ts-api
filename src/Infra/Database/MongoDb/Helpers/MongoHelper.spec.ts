import { MongoHelper as sut } from './MongoHelper';

describe('MongoHelper', () => {
    beforeAll(async () => {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        await sut.connect(process.env.MONGO_URL);
    });

    afterAll(async () => {
        await sut.disconnect();
    });

    it('should reconnect if mongodb is down', async () => {
        await sut.disconnect();
        const collection = await sut.getCollection('accounts');
        expect(collection).toBeTruthy();
    });
});
