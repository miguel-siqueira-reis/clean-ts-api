export class MissingParamError extends Error {
    public message: string;

    public constructor(paramMissingName: string) {
        const messageError = `Missing param: ${paramMissingName}`;
        super(messageError);
        this.name = 'MissingParam';
        this.message = messageError;
    }
}
