// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import { MongoClient } from 'mongodb';

export const MongoHelper = {
    connection: null,

    async connect(uri: string): Promise<void> {
        this.connection = await MongoClient.connect(uri, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
    },

    async disconnect(): Promise<void> {
        await this.connection?.close();
        this.connection = null;
    },
};
