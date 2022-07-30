import bcrypt from 'bcrypt';
import { BcryptAdapter } from './BcryptAdapter';

describe('BcryptAdapter', () => {
    it('should call bcrypt with correct params', async () => {
        const sut = new BcryptAdapter(12);
        const hashSpy = jest.spyOn(bcrypt, 'hash');
        await sut.encrypt('any_value');

        expect(hashSpy).toHaveBeenCalledWith('any_value', 12);
    });
});
