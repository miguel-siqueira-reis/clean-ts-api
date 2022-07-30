import {
    AddAccount,
    AddAccountModel,
    AccountModel,
    Encrypter,
    AddAccountRepository,
} from './DbAddAccountProtocols';

export class DbAddAccount implements AddAccount {
    private readonly encrypter: Encrypter;

    private readonly addAccountRepository: AddAccountRepository;

    constructor(
        encrypter: Encrypter,
        addAccountRepository: AddAccountRepository,
    ) {
        this.encrypter = encrypter;
        this.addAccountRepository = addAccountRepository;
    }

    async add(account: AddAccountModel): Promise<AccountModel> {
        const { name } = account;
        name.toString();

        const passwordHash = await this.encrypter.encrypt(account.password);

        return await this.addAccountRepository.add({
            ...account,
            password: passwordHash,
        });
    }
}
