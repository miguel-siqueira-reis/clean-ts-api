// eslint-disable-next-line import/no-extraneous-dependencies
import request from 'supertest';
import app from '../config/app';

describe('BodyParser', () => {
    it('should do body parser on request.body', async () => {
        app.post('/test/bodyparser', (req, res) => {
            res.send(req.body);
        });

        await request(app)
            .post('/test/bodyparser')
            .send({ name: 'any_name' })
            .expect({ name: 'any_name' });
    });
});
