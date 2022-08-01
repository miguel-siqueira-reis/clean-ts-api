import { MongoHelper } from '../../Infra/Database/Helpers/MongoHelper';

export default async function initDb() {
    const { MONGODB_HOST, MONGODB_PORT, MONGODB_DB } = process.env;
    await MongoHelper.connect(
        `mongodb://${MONGODB_HOST}:${MONGODB_PORT}/${MONGODB_DB}`,
        // eslint-disable-next-line no-console
    );
}
