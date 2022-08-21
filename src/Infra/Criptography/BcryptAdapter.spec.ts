import bcrypt from 'bcrypt';
import { BcryptAdapter } from './BcryptAdapter';

jest.mock('bcrypt', () => ({
    hash: (): Promise<string> => Promise.resolve('any_hash'),
    compare: (): Promise<boolean> => Promise.resolve(true),
}));

const salt = 12;
const makeSut = (): BcryptAdapter => new BcryptAdapter(salt);

describe('BcryptAdapter', () => {
    it('should call bcrypt hash with correct params', async () => {
        const sut = makeSut();
        const hashSpy = jest.spyOn(bcrypt, 'hash');
        await sut.hash('any_value');

        expect(hashSpy).toHaveBeenCalledWith('any_value', 12);
    });

    it('should return hash method the hash on success', async () => {
        const sut = makeSut();
        const hash = await sut.hash('any_value');

        expect(hash).toBe('any_hash');
    });

    it('should return throw if bcrypt hash throw', async () => {
        const sut = makeSut();
        jest.spyOn(bcrypt, 'hash').mockImplementation(() => {
            return Promise.reject(new Error());
        });
        const promise = sut.hash('any_value');

        await expect(promise).rejects.toThrow();
    });

    it('should call bcrypt compare with correct params', async () => {
        const sut = makeSut();
        const hashSpy = jest.spyOn(bcrypt, 'compare');
        await sut.compare('any_value', 'any_hash');

        expect(hashSpy).toHaveBeenCalledWith('any_value', 'any_hash');
    });

    it('should returns in compare true on success case', async () => {
        const sut = makeSut();
        const hash = await sut.compare('any_value', 'any_hash');

        expect(hash).toBe(true);
    });

    it('should returns in compare false on failure case', async () => {
        const sut = makeSut();
        jest.spyOn(bcrypt, 'compare').mockImplementation(() => {
            return Promise.resolve(false);
        });
        const hash = await sut.compare('any_value', 'other_hash');

        expect(hash).toBe(false);
    });

    it('should return throw if bcrypt compare throw', async () => {
        const sut = makeSut();
        jest.spyOn(bcrypt, 'compare').mockImplementation(() => {
            return Promise.reject(new Error());
        });
        const promise = sut.compare('any_value', 'any_hash');

        await expect(promise).rejects.toThrow();
    });
});
