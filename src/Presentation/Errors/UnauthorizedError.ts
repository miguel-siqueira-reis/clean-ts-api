export class UnauthorizedError extends Error {
    public readonly name = 'UnauthorizedError';

    constructor() {
        super('Unauthorized');
        this.name = 'UnauthorizedError';
    }
}
