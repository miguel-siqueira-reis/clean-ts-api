import { DbAddAccount } from './DbAddAccount';
import {
    AccountModel,
    AddAccount,
    AddAccountModel,
    Hasher,
    AddAccountRepository,
} from './DbAddAccountProtocols';

const makeFakeAccount = (): AccountModel => ({
    id: 'valid_id',
    name: 'valid_name',
    email: 'valid_mail@mail.com',
    password: 'valid_password',
});

const makeFakeAccountData = (): AddAccountModel => ({
    name: 'valid_name',
    email: 'valid_mail@mail.com',
    password: 'valid_password',
});

const makeAddAccountRepositoryStub = (): AddAccountRepository => {
    class AddAccountRepositoryStub implements AddAccountRepository {
        async add(account: AddAccountModel): Promise<AccountModel> {
            account.name.toString();
            return Promise.resolve(makeFakeAccount());
        }
    }

    return new AddAccountRepositoryStub();
};

const makeHasherStub = (): Hasher => {
    class HasherStub implements Hasher {
        async hash(password: string): Promise<string> {
            password.toString();
            return Promise.resolve('hashed_password');
        }
    }
    return new HasherStub();
};

interface MakeSutType {
    sut: AddAccount;
    hasherStub: Hasher;
    addAccountRepositoryStub: AddAccountRepository;
}

const makeSut = (): MakeSutType => {
    const addAccountRepositoryStub = makeAddAccountRepositoryStub();
    const hasherStub = makeHasherStub();
    const sut = new DbAddAccount(hasherStub, addAccountRepositoryStub);

    return {
        sut,
        hasherStub,
        addAccountRepositoryStub,
    };
};

describe('DbAddAccount', () => {
    it('should call Hasher with correct password', async () => {
        const { sut, hasherStub } = makeSut();
        const hashSpy = jest.spyOn(hasherStub, 'hash');
        await sut.add(makeFakeAccountData());

        expect(hashSpy).toHaveBeenCalledWith('valid_password');
    });

    it('should throw if Hasher throw', async () => {
        const { sut, hasherStub } = makeSut();
        jest.spyOn(hasherStub, 'hash').mockReturnValueOnce(
            Promise.reject(new Error()),
        );

        const promise = sut.add(makeFakeAccountData());

        await expect(promise).rejects.toThrow();
    });

    it('should call AddAccountRepository with correct values', async () => {
        const { sut, addAccountRepositoryStub } = makeSut();
        const addRepositorySpy = jest.spyOn(addAccountRepositoryStub, 'add');

        await sut.add(makeFakeAccountData());

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

        const promise = sut.add(makeFakeAccountData());

        await expect(promise).rejects.toThrow();
    });

    it('should return an Account if on success', async () => {
        const { sut } = makeSut();

        const response = await sut.add(makeFakeAccountData());

        expect(response).toEqual(makeFakeAccount());
    });
});
