export class ServerError extends Error {
    public readonly name = 'ServerError';

    constructor() {
        super('Internal server error');
    }
}
