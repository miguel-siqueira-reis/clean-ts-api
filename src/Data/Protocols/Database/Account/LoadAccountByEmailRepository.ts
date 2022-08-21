import { AccountModel } from '../../../../Domain/Models/Account';

export interface LoadAccountByEmailRepository {
    loadByEmail(email: string): Promise<AccountModel | null>;
}
