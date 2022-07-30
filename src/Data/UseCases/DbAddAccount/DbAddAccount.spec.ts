import { DbAddAccount } from './DbAddAccount';
import { AddAccount, Encrypter } from './DbAddAccountProtocols';

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
}

const makeSut = (): MakeSutType => {
    const encrypterStub = makeEncrypterStub();
    const sut = new DbAddAccount(encrypterStub);

    return {
        sut,
        encrypterStub,
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
});
