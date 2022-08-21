import {
    AddAccount,
    AddAccountModel,
    AccountModel,
    Hasher,
    AddAccountRepository,
} from './DbAddAccountProtocols';

export class DbAddAccount implements AddAccount {
    constructor(
        private readonly hasher: Hasher,
        private readonly addAccountRepository: AddAccountRepository,
    ) {}

    async add(account: AddAccountModel): Promise<AccountModel> {
        const passwordHash = await this.hasher.hash(account.password);

        return await this.addAccountRepository.add({
            ...account,
            password: passwordHash,
        });
    }
}
