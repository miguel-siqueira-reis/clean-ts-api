import { AddAccountRepository } from '../../../Data/Protocols/AddAccountRepository';
import { AddAccountModel } from '../../../Domain/useCases/AddAccount';
import { AccountModel } from '../../../Domain/Models/Account';
import { MongoHelper } from '../Helpers/MongoHelper';

export class AccountRepository implements AddAccountRepository {
    async add(accountData: AddAccountModel): Promise<AccountModel> {
        const accountCollection = await MongoHelper.getCollection('accounts');
        const result = await accountCollection.insertOne(accountData);
        return {
            id: result.insertedId.toString(),
            ...accountData,
        };
    }
}
