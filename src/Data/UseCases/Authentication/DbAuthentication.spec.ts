import {
    Authentication,
    AuthenticationData,
} from '../../../Domain/useCases/Authentication';
import { AccountModel } from '../../../Domain/Models/Account';
import { DbAuthentication } from './DbAuthentication';
import { LoadAccountByEmailRepository } from '../../Protocols/LoadAccountByEmailRepository';

const makeLoadAccountByEmailRepositoryStub =
    (): LoadAccountByEmailRepository => {
        class LoadAccountByEmailRepositoryStub
            implements LoadAccountByEmailRepository
        {
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            async load(email: string): Promise<AccountModel> {
                return new Promise((resolve) => {
                    resolve({
                        id: 'any_id',
                        name: 'any_name',
                        email: 'any_mail@mail.com',
                        password: 'any_password',
                    });
                });
            }
        }

        return new LoadAccountByEmailRepositoryStub();
    };

interface SutTypes {
    sut: Authentication;
    loadAccountByEmailRepositoryStub: LoadAccountByEmailRepository;
}
const makeSut = (): SutTypes => {
    const loadAccountByEmailRepositoryStub =
        makeLoadAccountByEmailRepositoryStub();
    const sut = new DbAuthentication(loadAccountByEmailRepositoryStub);

    return {
        sut,
        loadAccountByEmailRepositoryStub,
    };
};

const makeFakeAuthenticationData = (): AuthenticationData => ({
    email: 'any_mail@mail.com',
    password: 'any_password',
});

describe('DbAuthentication UseCase', () => {
    it('should call LoadAccountByEmailRepository with correct email', async () => {
        const { sut, loadAccountByEmailRepositoryStub } = makeSut();
        const loadSpy = jest.spyOn(loadAccountByEmailRepositoryStub, 'load');

        await sut.auth(makeFakeAuthenticationData());
        expect(loadSpy).toHaveBeenCalledWith('any_mail@mail.com');
    });

    it('should throws if LoadAccountByEmailRepository throws', async () => {
        const { sut, loadAccountByEmailRepositoryStub } = makeSut();
        jest.spyOn(
            loadAccountByEmailRepositoryStub,
            'load',
        ).mockReturnValueOnce(
            new Promise((resolve, reject) => {
                reject(new Error());
            }),
        );

        const promise = sut.auth(makeFakeAuthenticationData());

        await expect(promise).rejects.toThrow();
    });
});
