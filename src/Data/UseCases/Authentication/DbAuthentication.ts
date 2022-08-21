import {
    Authentication,
    AuthenticationData,
} from '../../../Domain/useCases/Authentication';
import { LoadAccountByEmailRepository } from '../../Protocols/Database/LoadAccountByEmailRepository';
import { HashComparer } from '../../Protocols/Criptography/HashComparer';
import { TokenGenerator } from '../../Protocols/Criptography/TokenGenerator';
import { UpdateAccessTokenRepository } from '../../Protocols/Database/UpdateAccessTokenRepository';

export class DbAuthentication implements Authentication {
    constructor(
        private readonly loadAccountByEmailRepository: LoadAccountByEmailRepository,
        private readonly hashComparer: HashComparer,
        private readonly tokenGenerator: TokenGenerator,
        private readonly updateAccessTokenRepository: UpdateAccessTokenRepository,
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
                const token = await this.tokenGenerator.generate(account.id);
                await this.updateAccessTokenRepository.update(
                    account.id,
                    token,
                );
                return token;
            }
        }
        return null;
    }
}
