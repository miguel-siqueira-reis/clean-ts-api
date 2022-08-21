import { AccountModel } from '../../../Domain/Models/Account';

export interface LoadAccountByEmailRepository {
    loadAccountByEmail(email: string): Promise<AccountModel | null>;
}
