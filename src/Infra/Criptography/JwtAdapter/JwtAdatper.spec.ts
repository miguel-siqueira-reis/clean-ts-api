import jwt from 'jsonwebtoken';
import { JwtAdatper } from './JwtAdatper';

jest.mock('jsonwebtoken', () => ({
    sign: (): Promise<string> => Promise.resolve('any_token'),
}));

describe('JwtAdapter', () => {
    it('should call sign with correct params', async () => {
        const sut = new JwtAdatper('secret');
        const signSpy = jest.spyOn(jwt, 'sign');

        await sut.encrypt('any_id');
        expect(signSpy).toHaveBeenCalledWith({ id: 'any_id' }, 'secret');
    });

    it('should return token on success', async () => {
        const sut = new JwtAdatper('secret');

        const token = await sut.encrypt('any_id');
        expect(token).toBe('any_token');
    });

    it('should throw if sign throws', async () => {
        const sut = new JwtAdatper('secret');
        jest.spyOn(jwt, 'sign').mockImplementationOnce(() => {
            throw new Error();
        });

        const promise = sut.encrypt('any_id');
        await expect(promise).rejects.toThrow();
    });
});
