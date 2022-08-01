import 'dotenv/config';
import { Express } from 'express';
import initDb from './config/db';
/* eslint-disable */

initDb()
    .then(async (_) => {
        const app: Express = (await import('./config/app')).default;

        const { PORT } = process.env;
        app.listen(PORT, () => {
            console.log(`Server running on port ${PORT}`);
            console.log(`Server running at http://localhost:${PORT}`);
        });
    })
    .catch((err) => console.log(err));
