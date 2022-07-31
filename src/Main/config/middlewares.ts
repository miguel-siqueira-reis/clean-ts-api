import { Express } from 'express';
import { bodyParser } from '../Middlewares/borderParser';
import { cors } from '../Middlewares/cors';
import { contentType } from '../Middlewares/contentType';

export default (app: Express): void => {
    app.use(bodyParser);
    app.use(cors);
    app.use(contentType);
};
