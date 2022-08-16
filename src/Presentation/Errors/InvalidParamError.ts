export class InvalidParamError extends Error {
    public message: string;

    public constructor(paramName: string) {
        const messageError = `Invalid param: ${paramName}`;
        super(messageError);
        this.name = 'InvalidParam';
        this.message = messageError;
    }
}
