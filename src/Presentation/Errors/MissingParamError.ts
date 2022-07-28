export class MissingParamError extends Error {
    public constructor(paramMissingName: string) {
        super(`Missing param: ${paramMissingName}`);
        this.name = 'MissingParam';
    }
}
