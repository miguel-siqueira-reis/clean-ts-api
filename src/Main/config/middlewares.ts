import { Express } from 'express';
import { bodyParser } from '../Middlewares/borderParser';

export default (app: Express): void => {
    app.use(bodyParser);
};
