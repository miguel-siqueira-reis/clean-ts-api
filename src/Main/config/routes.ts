import { Express, Router } from 'express';
import path from 'path';
import { readdirSync } from 'fs';

export default (app: Express): void => {
    const router = Router();
    readdirSync(path.resolve(__dirname, '..', 'routes')).map(async (file) => {
        if (
            file.includes('.spec.') ||
            file.includes('.test.') ||
            file.includes('.map')
        ) {
            return;
        }

        (await import(`../routes/${file}`)).default(router);
    });

    app.use('/api', router);
};
