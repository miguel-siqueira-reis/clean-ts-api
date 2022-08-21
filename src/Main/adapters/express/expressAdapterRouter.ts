import { Request, Response } from 'express';
import { Controller, HttpRequest } from '../../../Presentation/Protocols';

export const adapterRouter = (controller: Controller) => {
    return async (req: Request, res: Response) => {
        const httpRequest: HttpRequest = {
            body: req.body,
        };
        const httpResponse = await controller.handle(httpRequest);
        res.status(httpResponse.statusCode).json(httpResponse.body);
    };
};
