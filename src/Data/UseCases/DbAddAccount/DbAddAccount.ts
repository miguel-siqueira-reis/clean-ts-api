import {
    AddAccount,
    AddAccountModel,
    AccountModel,
    Encrypter,
} from './DbAddAccountProtocols';

export class DbAddAccount implements AddAccount {
    private readonly encrypter: Encrypter;

    constructor(encrypter: Encrypter) {
        this.encrypter = encrypter;
    }

    async add(account: AddAccountModel): Promise<AccountModel> {
        const { name } = account;
        name.toString();

        await this.encrypter.encrypt(account.password);
        return {
            id: 'valid_id',
            name: 'valid_name',
            email: 'valid_mail@mail.com',
            password: 'valid_password',
        };
    }
}
