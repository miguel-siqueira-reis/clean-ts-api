import { AccountModel } from '../../../Domain/Models/Account';

export interface LoadAccountByEmailRepository {
    load(email: string): Promise<AccountModel | null>;
}
