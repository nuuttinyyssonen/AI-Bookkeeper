import request from 'supertest';
import app from '../../app';

describe("Logout route", () => {

    it('Logs out successfully', async () => {
        const response = await request(app)
            .post('/api/auth/logout')
        expect(response.status).toBe(200);
        expect(response.body.message).toBe("Logged out successfully");
    });

    it('Clears token cookie', async () => {
        const response = await request(app)
            .post('/api/auth/logout')
            .set('Cookie', ['token=fake-token']);

        expect(response.status).toBe(200);

        const setCookie = response.headers['set-cookie'];
        const cookies = Array.isArray(setCookie) ? setCookie.join(';') : setCookie;

        expect(cookies).toBeDefined();
        expect(cookies).toContain('token=');
        expect(cookies).toContain('Expires=Thu, 01 Jan 1970');
    });
});