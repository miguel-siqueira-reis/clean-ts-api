import {
    Authentication,
    AuthenticationData,
} from '../../../Domain/useCases/Authentication';
import { LoadAccountByEmailRepository } from '../../Protocols/Database/LoadAccountByEmailRepository';
import { HashComparer } from '../../Protocols/Criptography/HashComparer';

export class DbAuthentication implements Authentication {
    constructor(
        private readonly loadAccountByEmailRepository: LoadAccountByEmailRepository,
        private readonly hashComparer: HashComparer,
    ) {}

    async auth({
        email,
        password,
    }: AuthenticationData): Promise<string | null> {
        const account = await this.loadAccountByEmailRepository.load(email);
        if (account) {
            await this.hashComparer.compare(password, account.password);
        }
        return null;
    }
}
