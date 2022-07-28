export class SignUpController {
    public handle(req: any): any {
        return {
            statusCode: 400,
            body: new Error('Name is required'),
        };
    }
}
