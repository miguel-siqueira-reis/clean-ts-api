import bcrypt from 'bcrypt';
import { BcryptAdapter } from './BcryptAdapter';

jest.mock('bcrypt', () => ({
    hash: (): Promise<string> => Promise.resolve('any_hash'),
}));

const salt = 12;
const makeSut = (): BcryptAdapter => new BcryptAdapter(salt);

describe('BcryptAdapter', () => {
    it('should call bcrypt with correct params', async () => {
        const sut = makeSut();
        const hashSpy = jest.spyOn(bcrypt, 'hash');
        await sut.encrypt('any_value');

        expect(hashSpy).toHaveBeenCalledWith('any_value', 12);
    });

    it('should returns hash on success', async () => {
        const sut = makeSut();
        const hash = await sut.encrypt('any_value');

        expect(hash).toBe('any_hash');
    });
});
