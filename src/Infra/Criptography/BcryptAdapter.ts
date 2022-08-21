import bcrypt from 'bcrypt';
import { Hasher } from '../../Data/Protocols/Criptography/Hasher';
import { HashComparer } from '../../Data/Protocols/Criptography/HashComparer';

export class BcryptAdapter implements Hasher, HashComparer {
    private readonly salt: number;

    constructor(salt: number) {
        this.salt = salt;
    }

    async hash(password: string): Promise<string> {
        return await bcrypt.hash(password, this.salt);
    }

    async compare(value: string, hash: string): Promise<boolean> {
        return await bcrypt.compare(value, hash);
    }
}
