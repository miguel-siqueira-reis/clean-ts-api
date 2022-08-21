import { AddAccountRepository } from '../../../../Data/Protocols/Database/AddAccountRepository';
import { AddAccountModel } from '../../../../Domain/useCases/AddAccount';
import { AccountModel } from '../../../../Domain/Models/Account';
import { MongoHelper } from '../Helpers/MongoHelper';
import { LoadAccountByEmailRepository } from '../../../../Data/Protocols/Database/LoadAccountByEmailRepository';

export class AccountRepository
    implements AddAccountRepository, LoadAccountByEmailRepository
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
}
