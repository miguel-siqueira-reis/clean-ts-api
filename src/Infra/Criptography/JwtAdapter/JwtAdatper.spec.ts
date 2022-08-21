import jwt from 'jsonwebtoken';
import { JwtAdatper } from './JwtAdatper';

describe('JwtAdapter', () => {
    it('should call sign with correct params', async () => {
        const sut = new JwtAdatper('secret');
        const signSpy = jest.spyOn(jwt, 'sign');

        await sut.encrypt('any_id');

        expect(signSpy).toHaveBeenCalledWith({ id: 'any_id' }, 'secret');
    });
});
