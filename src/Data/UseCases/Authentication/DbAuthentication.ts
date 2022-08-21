import {
    Authentication,
    AuthenticationData,
    LoadAccountByEmailRepository,
    HashComparer,
    Encrypter,
    UpdateAccessTokenRepository,
} from './DbAuthenticationProtocols';

export class DbAuthentication implements Authentication {
    constructor(
        private readonly loadAccountByEmailRepository: LoadAccountByEmailRepository,
        private readonly hashComparer: HashComparer,
        private readonly encrypter: Encrypter,
        private readonly updateAccessTokenRepository: UpdateAccessTokenRepository,
    ) {}

    async auth({
        email,
        password,
    }: AuthenticationData): Promise<string | null> {
        const account = await this.loadAccountByEmailRepository.loadByEmail(
            email,
        );
        if (account) {
            const comparePassword = await this.hashComparer.compare(
                password,
                account.password,
            );
            if (comparePassword) {
                const token = await this.encrypter.encrypt(account.id);
                await this.updateAccessTokenRepository.updateAccessToken(
                    account.id,
                    token,
                );
                return token;
            }
        }
        return null;
    }
}
