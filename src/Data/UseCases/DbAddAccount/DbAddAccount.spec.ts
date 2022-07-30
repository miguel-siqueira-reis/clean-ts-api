import { DbAddAccount } from './DbAddAccount';
import {
    AccountModel,
    AddAccount,
    AddAccountModel,
    Encrypter,
    AddAccountRepository,
} from './DbAddAccountProtocols';

const makeAddAccountRepositoryStub = (): AddAccountRepository => {
    class AddAccountRepositoryStub implements AddAccountRepository {
        async add(account: AddAccountModel): Promise<AccountModel> {
            account.name.toString();
            return Promise.resolve({
                id: 'valid_id',
                ...account,
            });
        }
    }

    return new AddAccountRepositoryStub();
};

const makeEncrypterStub = (): Encrypter => {
    class EncrypterStub implements Encrypter {
        async encrypt(password: string): Promise<string> {
            password.toString();
            return Promise.resolve('hashed_password');
        }
    }
    return new EncrypterStub();
};

interface MakeSutType {
    sut: AddAccount;
    encrypterStub: Encrypter;
    addAccountRepositoryStub: AddAccountRepository;
}

const makeSut = (): MakeSutType => {
    const addAccountRepositoryStub = makeAddAccountRepositoryStub();
    const encrypterStub = makeEncrypterStub();
    const sut = new DbAddAccount(encrypterStub, addAccountRepositoryStub);

    return {
        sut,
        encrypterStub,
        addAccountRepositoryStub,
    };
};

describe('DbAddAccount', () => {
    it('should call Encrypter with correct password', async () => {
        const { sut, encrypterStub } = makeSut();
        const encryptSpy = jest.spyOn(encrypterStub, 'encrypt');
        await sut.add({
            name: 'valid_name',
            email: 'valid_mail@mail.com',
            password: 'valid_password',
        });

        expect(encryptSpy).toHaveBeenCalledWith('valid_password');
    });

    it('should throw if Encrypter throw', async () => {
        const { sut, encrypterStub } = makeSut();
        jest.spyOn(encrypterStub, 'encrypt').mockReturnValueOnce(
            Promise.reject(new Error()),
        );

        const promise = sut.add({
            name: 'valid_name',
            email: 'valid_mail@mail.com',
            password: 'valid_password',
        });

        await expect(promise).rejects.toThrow();
    });

    it('should call AddAccountRepository with correct values', async () => {
        const { sut, addAccountRepositoryStub } = makeSut();
        const addRepositorySpy = jest.spyOn(addAccountRepositoryStub, 'add');

        await sut.add({
            name: 'valid_name',
            email: 'valid_mail@mail.com',
            password: 'valid_password',
        });

        expect(addRepositorySpy).toHaveBeenCalledWith({
            name: 'valid_name',
            email: 'valid_mail@mail.com',
            password: 'hashed_password',
        });
    });

    it('should throw if AddAccountRepository throw', async () => {
        const { sut, addAccountRepositoryStub } = makeSut();
        jest.spyOn(addAccountRepositoryStub, 'add').mockReturnValueOnce(
            Promise.reject(new Error()),
        );

        const promise = sut.add({
            name: 'valid_name',
            email: 'valid_mail@mail.com',
            password: 'valid_password',
        });

        await expect(promise).rejects.toThrow();
    });

    it('should return an Account if on success', async () => {
        const { sut } = makeSut();

        const response = await sut.add({
            name: 'valid_name',
            email: 'valid_mail@mail.com',
            password: 'valid_password',
        });

        expect(response).toEqual({
            id: 'valid_id',
            name: 'valid_name',
            email: 'valid_mail@mail.com',
            password: 'hashed_password',
        });
    });
});
