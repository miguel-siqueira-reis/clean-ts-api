import {
    Authentication,
    AuthenticationData,
} from '../../../Domain/useCases/Authentication';
import { LoadAccountByEmailRepository } from '../../Protocols/LoadAccountByEmailRepository';

export class DbAuthentication implements Authentication {
    constructor(
        private readonly loadAccountByEmailRepository: LoadAccountByEmailRepository,
    ) {}

    async auth({ email }: AuthenticationData): Promise<string | null> {
        await this.loadAccountByEmailRepository.load(email);
        return null;
    }
}
