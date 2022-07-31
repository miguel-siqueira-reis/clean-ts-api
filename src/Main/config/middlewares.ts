import { Express } from 'express';
import { bodyParser } from '../Middlewares/borderParser';
import { cors } from '../Middlewares/cors';

export default (app: Express): void => {
    app.use(bodyParser);
    app.use(cors);
};
