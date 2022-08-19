import {
    Authentication,
    AuthenticationData,
} from '../../../Domain/useCases/Authentication';
import { LoadAccountByEmailRepository } from '../../Protocols/Database/LoadAccountByEmailRepository';
import { HashComparer } from '../../Protocols/Criptography/HashComparer';
import { TokenGenerator } from '../../Protocols/Criptography/TokenGenerator';

export class DbAuthentication implements Authentication {
    constructor(
        private readonly loadAccountByEmailRepository: LoadAccountByEmailRepository,
        private readonly hashComparer: HashComparer,
        private readonly tokenGenerator: TokenGenerator,
    ) {}

    async auth({
        email,
        password,
    }: AuthenticationData): Promise<string | null> {
        const account = await this.loadAccountByEmailRepository.load(email);
        if (account) {
            const comparePassword = await this.hashComparer.compare(
                password,
                account.password,
            );
            if (comparePassword) {
                return await this.tokenGenerator.generate(account.id);
            }
        }
        return null;
    }
}
