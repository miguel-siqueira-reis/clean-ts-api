export class ServerError extends Error {
    error;

    public readonly name = 'ServerError';

    constructor(stack?: string) {
        super('Internal server error');
        this.name = 'ServerError';
        this.stack = stack;
    }
}
