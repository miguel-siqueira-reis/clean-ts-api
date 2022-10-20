import { MongoHelper } from '../../Infra/Database/MongoDb/Helpers/MongoHelper';

export default async function initDb() {
    const {
        MONGO_USER,
        MONGO_PASSWORD,
        MONGODB_CLUSTER,
        MONGODB_DB,
        MONGO_MODE,
    } = process.env;

    let mongoUrl;

    if (MONGO_MODE === 'production') {
        mongoUrl = `mongodb+srv://${MONGO_USER}:${MONGO_PASSWORD}@${MONGODB_CLUSTER}.gmwdppo.mongodb.net/${MONGODB_DB}?retryWrites=true&w=majority`;
    } else {
        mongoUrl = `mongodb://mongo:27017/clean-node-api`;
    }

    await MongoHelper.connect(mongoUrl);
}
