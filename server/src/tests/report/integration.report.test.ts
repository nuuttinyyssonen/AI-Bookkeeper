import request from "supertest";
import app from "../../app";
import createUser from "../helpers/createUser";
import { prisma } from "../../lib/prisma";
import { supabaseAdmin } from "../../lib/supabase";
import redis from "../../lib/redis";

jest.mock("../../middleware/subscription", () => ({
    requireSubscription: jest.fn((req, res, next) => next())
}));

describe('dashboard data route', () => {
    let token: string;
    let email: string;
    let user_id: string;
    let report_id: string;
    let business_id: string

    beforeAll(async () => {
        await redis.flushdb();
        email = `integration.report.test${Date.now()}@admin.com`;
        business_id = "1111111-8";
        const user = await createUser(email, business_id);
        user_id = user.id;
        const response = await request(app)
            .post('/api/auth/login')
            .send({ email, password: '123456' });
        token = response.body.user.token;
    });

    it('Creates report successfully', async () => {
        const response = await request(app)
            .post('/api/report')
            .set('Cookie', `token=${token}`)
            .send({ timePeriod: "Q1" });

        expect(response.status).toBe(201);
        expect(response.body).toMatchObject({
            period_start: '2025-12-31T22:00:00.000Z',
            period_end: '2026-03-30T21:00:00.000Z',
            period_type: 'Q1',
            sales_net: '0',
            sales_vat_amount: '0',
            sales_gross: '0',
            purchase_net: '0',
            purchase_vat_amount: '0',
            purchase_gross: '0',
            vat_payable: '0',
            vat_breakdown: { sales: [], purchases: [] },
            vat_declaration_sent: false,
            pdf_path: null,
        });

        // Assert dynamic fields separately
        expect(response.body.created_at).toBeDefined();
        expect(new Date(response.body.created_at).toString()).not.toBe('Invalid Date');
    });

    it('Gets all users reports', async () => {
        const response = await request(app)
            .get('/api/report')
            .set('Cookie', `token=${token}`)

        expect(response.status).toBe(200);
        expect(response.body).toMatchObject({
            reports: [
                {
                pdf_path: null,
                period_end: '2026-03-30T21:00:00.000Z',
                period_start: '2025-12-31T22:00:00.000Z',
                period_type: 'Q1',
                purchase_gross: '0',
                purchase_net: '0',
                purchase_vat_amount: '0',
                sales_gross: '0',
                sales_net: '0',
                sales_vat_amount: '0',
                vat_breakdown: { purchases: [], sales: [] },
                vat_declaration_sent: false,
                vat_payable: '0',
                }
            ]
        });

        report_id = response.body.reports[0].id;

        // Assert dynamic fields on the first report
        const report = response.body.reports[0];
        expect(report.id).toBeDefined();
        expect(report.user_id).toBeDefined();
        expect(new Date(report.created_at).toString()).not.toBe('Invalid Date');
    });

    it('Gets report by id', async () => {
        const response = await request(app)
            .get(`/api/report/${report_id}`)
            .set('Cookie', `token=${token}`)

        expect(response.body).toMatchObject({
            period_start: '2025-12-31T22:00:00.000Z',
            period_end: '2026-03-30T21:00:00.000Z',
            period_type: 'Q1',
            sales_net: '0',
            sales_vat_amount: '0',
            sales_gross: '0',
            purchase_net: '0',
            purchase_vat_amount: '0',
            purchase_gross: '0',
            vat_payable: '0',
            vat_breakdown: { sales: [], purchases: [] },
            vat_declaration_sent: false,
            pdf_path: null,
        });

        expect(response.body.id).toBeDefined();
        expect(response.body.user_id).toBeDefined();
        expect(new Date(response.body.created_at).toString()).not.toBe('Invalid Date'); 
    });

    it('Gets report PDF successfully', async () => {
        const response = await request(app)
            .get(`/api/report/${report_id}/pdf`)
            .set('Cookie', `token=${token}`)
            .buffer(true)                    // collect the stream into a buffer
            .parse((res, callback) => {      // prevent supertest treating it as text
                const chunks: Buffer[] = [];
                res.on('data', (chunk) => chunks.push(chunk));
                res.on('end', () => callback(null, Buffer.concat(chunks)));
            });

        expect(response.status).toBe(200);
        expect(response.headers['content-type']).toBe('application/pdf');
        expect(response.headers['content-disposition']).toContain(`vat-report-Q1-${report_id}`);

        // Check it's actually a PDF (PDF magic bytes: %PDF)
        expect(response.body.slice(0, 4).toString()).toBe('%PDF');
    });

    it('Returns 400 if report id is not uuid', async () => {
        const response = await request(app)
            .get(`/api/report/non-existent-id/pdf`)
            .set('Cookie', `token=${token}`);

        expect(response.status).toBe(400);
        expect(response.body.message).toBe('Invalid ID format');
    });

    it('Returns 401 for PDF route if not authenticated', async () => {
        const response = await request(app)
            .get(`/api/report/${report_id}/pdf`);

        expect(response.status).toBe(401);
    });

    it('returns 401 if no token in request', async () => {
        const response = await request(app)
            .get('/api/report')
        
        expect(response.status).toBe(401);
        expect(response.body.message).toBe("Token is missing");
    });

    it('returns 401 if token is invalid', async () => {
        const response = await request(app)
            .get('/api/report')
            .set('Cookie', `token=$1239218390213i90wiqdkasdnl`)
        
        expect(response.status).toBe(401);
        expect(response.body.message).toBe("Token is invalid or expired");
    });

    afterAll(async () => {
        if(!user_id) return;  

        const user = await prisma.user.findUnique({ where: { id: user_id } });

        // Delete dependent records first
        await prisma.vatReport.deleteMany({ where: { user_id } });
        if (user?.supabase_id) {
            await supabaseAdmin.auth.admin.deleteUser(user.supabase_id);
        }

        if (user_id) {
            await prisma.user.delete({ where: { id: user_id } });
        }
    });
});