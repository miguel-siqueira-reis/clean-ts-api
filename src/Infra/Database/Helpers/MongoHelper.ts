// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import { MongoClient, Collection } from 'mongodb';

export const MongoHelper = {
    client: null as null | MongoClient,
    uri: '' as string,

    async connect(uri: string = this.uri): Promise<void> {
        this.uri = uri;
        this.client = await MongoClient.connect(this.uri, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
    },

    async disconnect(): Promise<void> {
        await this.client.close();
        this.client = null;
    },

    async getCollection(name: string): Promise<Collection> {
        !(await this.isConnected()) && (await this.connect());

        return this.client.db().collection(name);
    },

    async isConnected() {
        return !!this.client?.topology.isConnected();
    },
};
