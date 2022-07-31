// eslint-disable-next-line import/no-extraneous-dependencies
import request from 'supertest';
import app from '../config/app';

describe('ContentType', () => {
    it('should return default content-type as json', async () => {
        app.get('/test/contenttype', (req, res) => {
            res.send('');
        });

        await request(app)
            .get('/test/contenttype')
            .expect('content-type', /json/);
    });

    it('should return xml if forced', async () => {
        app.get('/test/forcedxml', (req, res) => {
            res.type('xml');
            res.send('');
        });

        await request(app).get('/test/forcedxml').expect('content-type', /xml/);
    });
});
