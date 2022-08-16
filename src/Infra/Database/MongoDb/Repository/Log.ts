import { LogErrorRepository } from '../../../../Data/Protocols/LogErrorRepository';
import { MongoHelper } from '../Helpers/MongoHelper';

export class LogRepository implements LogErrorRepository {
    async logError(stack: string): Promise<void> {
        const errorCollection = await MongoHelper.getCollection('errors');
        await errorCollection.insertOne({ stack, date: new Date() });
    }
}
