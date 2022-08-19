import bcrypt from 'bcrypt';
import { Encrypter } from '../../Data/Protocols/Criptography/Encrypter';

export class BcryptAdapter implements Encrypter {
    private readonly salt: number;

    constructor(salt: number) {
        this.salt = salt;
    }

    async encrypt(password: string): Promise<string> {
        return await bcrypt.hash(password, this.salt);
    }
}
