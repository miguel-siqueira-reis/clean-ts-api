import jwt from 'jsonwebtoken';
import { Encrypter } from '../../../Data/Protocols/Criptography/Encrypter';

export class JwtAdatper implements Encrypter {
    constructor(private readonly secret: string) {}

    public async encrypt(id: string): Promise<string> {
        return jwt.sign({ id }, this.secret);
    }
}
