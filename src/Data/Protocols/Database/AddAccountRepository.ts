import { AddAccountModel } from '../../../Domain/useCases/AddAccount';
import { AccountModel } from '../../../Domain/Models/Account';

export interface AddAccountRepository {
    add(accountData: AddAccountModel): Promise<AccountModel>;
}
