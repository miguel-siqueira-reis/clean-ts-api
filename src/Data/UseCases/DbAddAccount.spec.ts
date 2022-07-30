import { AddAccount } from '../../Domain/useCases/AddAccount';
import { DbAddAccount } from './DbAddAccount';
import { Encrypter } from '../Protocols/Encrypter';

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
});
