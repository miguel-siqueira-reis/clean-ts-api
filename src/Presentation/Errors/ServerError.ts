export class ServerError extends Error {
    public readonly name = 'ServerError';

    constructor(stack?: string) {
        super('Internal server error');
        this.name = 'ServerError';
        this.stack = stack;
    }
}
