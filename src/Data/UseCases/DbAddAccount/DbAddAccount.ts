import {
    AddAccount,
    AddAccountModel,
    AccountModel,
    Hasher,
    AddAccountRepository,
} from './DbAddAccountProtocols';

export class DbAddAccount implements AddAccount {
    private readonly hasher: Hasher;

    private readonly addAccountRepository: AddAccountRepository;

    constructor(hasher: Hasher, addAccountRepository: AddAccountRepository) {
        this.hasher = hasher;
        this.addAccountRepository = addAccountRepository;
    }

    async add(account: AddAccountModel): Promise<AccountModel> {
        const passwordHash = await this.hasher.hash(account.password);

        return await this.addAccountRepository.add({
            ...account,
            password: passwordHash,
        });
    }
}
