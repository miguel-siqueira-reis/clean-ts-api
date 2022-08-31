import { MongoHelper } from '../../Infra/Database/MongoDb/Helpers/MongoHelper';

export default async function initDb() {
    const { MONGO_USER, MONGO_PASSWORD, MONGODB_CLUSTER, MONGODB_DB } =
        process.env;

    await MongoHelper.connect(
        `mongodb+srv://${MONGO_USER}:${MONGO_PASSWORD}@${MONGODB_CLUSTER}.gmwdppo.mongodb.net/${MONGODB_DB}?retryWrites=true&w=majority`,
        // eslint-disable-next-line no-console
    );
}
