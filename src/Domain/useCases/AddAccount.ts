import { AccountModel } from '../Models/Account';

export interface AddAccountModel {
    name: string;
    email: string;
    password: string;
}

export interface AddAccount {
    add: (account: AddAccountModel) => Promise<AccountModel>;
}
