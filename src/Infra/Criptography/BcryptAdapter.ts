import bcrypt from 'bcrypt';
import { Hasher } from '../../Data/Protocols/Criptography/Hasher';

export class BcryptAdapter implements Hasher {
    private readonly salt: number;

    constructor(salt: number) {
        this.salt = salt;
    }

    async hash(password: string): Promise<string> {
        return await bcrypt.hash(password, this.salt);
    }
}
