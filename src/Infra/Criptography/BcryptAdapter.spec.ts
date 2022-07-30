import bcrypt from 'bcrypt';
import { BcryptAdapter } from './BcryptAdapter';

jest.mock('bcrypt', () => ({
    hash: (): Promise<string> => Promise.resolve('any_hash'),
}));

describe('BcryptAdapter', () => {
    it('should call bcrypt with correct params', async () => {
        const sut = new BcryptAdapter(12);
        const hashSpy = jest.spyOn(bcrypt, 'hash');
        await sut.encrypt('any_value');

        expect(hashSpy).toHaveBeenCalledWith('any_value', 12);
    });

    it('should returns hash on success', async () => {
        const sut = new BcryptAdapter(12);
        const hash = await sut.encrypt('any_value');

        expect(hash).toBe('any_hash');
    });
});
