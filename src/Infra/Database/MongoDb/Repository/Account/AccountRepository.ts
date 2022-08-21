import { ObjectId } from 'mongodb';
import { AddAccountRepository } from '../../../../../Data/Protocols/Database/Account/AddAccountRepository';
import { AddAccountModel } from '../../../../../Domain/useCases/AddAccount';
import { AccountModel } from '../../../../../Domain/Models/Account';
import { MongoHelper } from '../../Helpers/MongoHelper';
import { LoadAccountByEmailRepository } from '../../../../../Data/Protocols/Database/Account/LoadAccountByEmailRepository';
import { UpdateAccessTokenRepository } from '../../../../../Data/Protocols/Database/Account/UpdateAccessTokenRepository';

export class AccountRepository
    implements
        AddAccountRepository,
        LoadAccountByEmailRepository,
        UpdateAccessTokenRepository
{
    async add(accountData: AddAccountModel): Promise<AccountModel> {
        const accountCollection = await MongoHelper.getCollection('accounts');
        const result = await accountCollection.insertOne(accountData);
        return {
            id: result.insertedId.toString(),
            ...accountData,
        };
    }

    async loadByEmail(email: string): Promise<AccountModel | null> {
        const accountCollection = await MongoHelper.getCollection('accounts');
        const accountData = await accountCollection.findOne({
            email,
        });

        return (
            accountData && {
                // eslint-disable-next-line no-underscore-dangle
                id: accountData._id.toString(),
                name: String(accountData.name),
                email: String(accountData.email),
                password: String(accountData.password),
            }
        );
    }

    async updateAccessToken(id: string, token: string): Promise<void> {
        const accountCollection = await MongoHelper.getCollection('accounts');
        await accountCollection.updateOne(
            { _id: new ObjectId(id) },
            {
                $set: {
                    accessToken: token,
                },
            },
        );
    }
}
