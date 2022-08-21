import { DbAuthentication } from './DbAuthentication';
import {
    Authentication,
    AuthenticationData,
    AccountModel,
    LoadAccountByEmailRepository,
    HashComparer,
    TokenGenerator,
    UpdateAccessTokenRepository,
} from './DbAtuhenticationProtocols';

const makeUpdateAccessTokenRepositoryStub = (): UpdateAccessTokenRepository => {
    class UpdateAccessTokenRepositoryStub
        implements UpdateAccessTokenRepository
    {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        async update(id: string, token: string): Promise<void> {
            return new Promise((resolve) => {
                resolve();
            });
        }
    }

    return new UpdateAccessTokenRepositoryStub();
};

const makeTokenGeneratorStub = (): TokenGenerator => {
    class TokenGeneratorStub implements TokenGenerator {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        async generate(id: string): Promise<string> {
            return new Promise((resolve) => {
                resolve('any_token');
            });
        }
    }

    return new TokenGeneratorStub();
};

const makeHashComparerStub = (): HashComparer => {
    class HashComparerStub implements HashComparer {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        async compare(password: string, hash: string): Promise<boolean> {
            return new Promise((resolve) => {
                resolve(true);
            });
        }
    }

    return new HashComparerStub();
};

const makeLoadAccountByEmailRepositoryStub =
    (): LoadAccountByEmailRepository => {
        class LoadAccountByEmailRepositoryStub
            implements LoadAccountByEmailRepository
        {
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            async load(email: string): Promise<AccountModel | null> {
                return new Promise((resolve) => {
                    resolve({
                        id: 'any_id',
                        name: 'any_name',
                        email: 'any_mail@mail.com',
                        password: 'hashed_password',
                    });
                });
            }
        }

        return new LoadAccountByEmailRepositoryStub();
    };

interface SutTypes {
    sut: Authentication;
    loadAccountByEmailRepositoryStub: LoadAccountByEmailRepository;
    hashComparerStub: HashComparer;
    tokenGeneratorStub: TokenGenerator;
    updateAccessTokenRepositoryStub: UpdateAccessTokenRepository;
}
const makeSut = (): SutTypes => {
    const updateAccessTokenRepositoryStub =
        makeUpdateAccessTokenRepositoryStub();
    const tokenGeneratorStub = makeTokenGeneratorStub();
    const hashComparerStub = makeHashComparerStub();
    const loadAccountByEmailRepositoryStub =
        makeLoadAccountByEmailRepositoryStub();
    const sut = new DbAuthentication(
        loadAccountByEmailRepositoryStub,
        hashComparerStub,
        tokenGeneratorStub,
        updateAccessTokenRepositoryStub,
    );

    return {
        sut,
        loadAccountByEmailRepositoryStub,
        hashComparerStub,
        tokenGeneratorStub,
        updateAccessTokenRepositoryStub,
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

    it('should return null if LoadAccountByEmailRepository returns null', async () => {
        const { sut, loadAccountByEmailRepositoryStub } = makeSut();
        jest.spyOn(
            loadAccountByEmailRepositoryStub,
            'load',
        ).mockReturnValueOnce(new Promise((resolve) => resolve(null)));

        const accesToken = await sut.auth(makeFakeAuthenticationData());
        expect(accesToken).toBeNull();
    });

    it('should call HashComparer with correct values', async () => {
        const { sut, hashComparerStub } = makeSut();
        const compareSpy = jest.spyOn(hashComparerStub, 'compare');

        await sut.auth(makeFakeAuthenticationData());
        expect(compareSpy).toHaveBeenCalledWith(
            'any_password',
            'hashed_password',
        );
    });

    it('should throws if HashComparer throws', async () => {
        const { sut, hashComparerStub } = makeSut();
        jest.spyOn(hashComparerStub, 'compare').mockReturnValueOnce(
            new Promise((resolve, reject) => {
                reject(new Error());
            }),
        );

        const promise = sut.auth(makeFakeAuthenticationData());
        await expect(promise).rejects.toThrow();
    });

    it('should return null if HashComparer returns false', async () => {
        const { sut, hashComparerStub } = makeSut();
        jest.spyOn(hashComparerStub, 'compare').mockReturnValueOnce(
            new Promise((resolve) => resolve(false)),
        );

        const accesToken = await sut.auth(makeFakeAuthenticationData());
        expect(accesToken).toBeNull();
    });

    it('should call Tokengenerator with correct values', async () => {
        const { sut, tokenGeneratorStub } = makeSut();
        const generateSpy = jest.spyOn(tokenGeneratorStub, 'generate');

        await sut.auth(makeFakeAuthenticationData());
        expect(generateSpy).toHaveBeenCalledWith('any_id');
    });

    it('should returns throw if Tokengenerator throws', async () => {
        const { sut, tokenGeneratorStub } = makeSut();
        jest.spyOn(tokenGeneratorStub, 'generate').mockReturnValueOnce(
            new Promise((resolve, reject) => {
                reject(new Error());
            }),
        );

        const promise = sut.auth(makeFakeAuthenticationData());
        await expect(promise).rejects.toThrow();
    });

    it('should returns an account with correct accessToken if all is ok', async () => {
        const { sut } = makeSut();
        const token = await sut.auth(makeFakeAuthenticationData());
        expect(token).toEqual('any_token');
    });

    it('should call UpdateAccessTokenRepository with correct values id, token', async () => {
        const { sut, updateAccessTokenRepositoryStub } = makeSut();
        const generateSpy = jest.spyOn(
            updateAccessTokenRepositoryStub,
            'update',
        );

        await sut.auth(makeFakeAuthenticationData());
        expect(generateSpy).toHaveBeenCalledWith('any_id', 'any_token');
    });

    it('should returns throw if UpdateAccessTokenRepository throws', async () => {
        const { sut, updateAccessTokenRepositoryStub } = makeSut();
        jest.spyOn(
            updateAccessTokenRepositoryStub,
            'update',
        ).mockReturnValueOnce(
            new Promise((resolve, reject) => {
                reject(new Error());
            }),
        );

        const promise = sut.auth(makeFakeAuthenticationData());
        await expect(promise).rejects.toThrow();
    });
});
