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
    let dummy_document_id: string;
    let q2_report_id: string;
    let q3_report_id: string;
    let q4_report_id: string;
    let q4_refund_report_id: string;

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

    it('Fails to create a report with an invalid time period', async () => {
        const response = await request(app)
            .post('/api/report')
            .set('Cookie', `token=${token}`)
            .send({ timePeriod: "a" });

        expect(response.status).toBe(400);
        expect(response.body.message).toBe("Invalid time period");
    });

    it('Creates a Q2 report with no receipts', async () => {
        const response = await request(app)
            .post('/api/report')
            .set('Cookie', `token=${token}`)
            .send({ timePeriod: "Q2" });

        expect(response.status).toBe(201);
        expect(response.body.period_type).toBe("Q2");
        q2_report_id = response.body.id;
    });

    it('Creates a Q3 report with no receipts', async () => {
        const response = await request(app)
            .post('/api/report')
            .set('Cookie', `token=${token}`)
            .send({ timePeriod: "Q3" });

        expect(response.status).toBe(201);
        expect(response.body.period_type).toBe("Q3");
        q3_report_id = response.body.id;
    });

    it('Creates a Q4 report with no receipts', async () => {
        const response = await request(app)
            .post('/api/report')
            .set('Cookie', `token=${token}`)
            .send({ timePeriod: "Q4" });

        expect(response.status).toBe(201);
        expect(response.body.period_type).toBe("Q4");
        q4_report_id = response.body.id;
    });

    it('Creates a Monthly report with no receipts', async () => {
        const response = await request(app)
            .post('/api/report')
            .set('Cookie', `token=${token}`)
            .send({ timePeriod: "Monthly" });

        expect(response.status).toBe(201);
        expect(response.body.period_type).toBe("MONTHLY");
    });

    it('Creates a Yearly report with no receipts (default period)', async () => {
        const response = await request(app)
            .post('/api/report')
            .set('Cookie', `token=${token}`)
            .send({ timePeriod: "Yearly" });

        expect(response.status).toBe(201);
        expect(response.body.period_type).toBe("YEARLY");
    });

    it('Fails to get a report with an invalid id', async () => {
        const response = await request(app)
            .get(`/api/report/not-a-uuid`)
            .set('Cookie', `token=${token}`);

        expect(response.status).toBe(400);
        expect(response.body.message).toBe("Invalid ID format");
    });

    it('Returns 404 for a report that does not exist', async () => {
        const response = await request(app)
            .get(`/api/report/00000000-0000-0000-0000-000000000000`)
            .set('Cookie', `token=${token}`);

        expect(response.status).toBe(404);
        expect(response.body.message).toBe("Report not found");
    });

    it('Returns 404 for a pdf of a report that does not exist', async () => {
        const response = await request(app)
            .get(`/api/report/00000000-0000-0000-0000-000000000000/pdf`)
            .set('Cookie', `token=${token}`);

        expect(response.status).toBe(404);
        expect(response.body.message).toBe("Report not found");
    });

    it('Fails to delete a report with an invalid id', async () => {
        const response = await request(app)
            .delete(`/api/report/not-a-uuid`)
            .set('Cookie', `token=${token}`);

        expect(response.status).toBe(400);
        expect(response.body.message).toBe("Invalid ID format");
    });

    it('Deletes a report successfully', async () => {
        const response = await request(app)
            .delete(`/api/report/${q3_report_id}`)
            .set('Cookie', `token=${token}`);

        expect(response.status).toBe(200);
        expect(response.body.message).toBe("report deleted successfully");
    });

    it('Fails to mark a report declaration as sent with an invalid id', async () => {
        const response = await request(app)
            .put(`/api/report/not-a-uuid/declaration-sent`)
            .set('Cookie', `token=${token}`);

        expect(response.status).toBe(400);
        expect(response.body.message).toBe("Invalid ID format");
    });

    it('Marks a report declaration as sent', async () => {
        const response = await request(app)
            .put(`/api/report/${q4_report_id}/declaration-sent`)
            .set('Cookie', `token=${token}`);

        expect(response.status).toBe(200);
        expect(response.body.message).toBe("report updated successfully");

        const getResponse = await request(app)
            .get(`/api/report/${q4_report_id}`)
            .set('Cookie', `token=${token}`);
        expect(getResponse.body.vat_declaration_sent).toBe(true);
    });

    it('Sets up receipts for VAT calculation in Q2', async () => {
        const document = await prisma.document.create({
            data: {
                document_name: `test-report-doc-${Date.now()}`,
                document_type: "image/jpeg",
                document_size: 100,
                file_path: "dummy/path",
                user_id
            }
        });
        dummy_document_id = document.id;

        // Two INCOME receipts sharing a VAT rate, to exercise both the "new rate" and
        // "merge into existing rate" branches of the sales VAT grouping.
        await prisma.receipt.create({
            data: {
                document_id: dummy_document_id,
                user_id,
                vendor_name: "Sale A",
                total_amount: 124,
                receipt_date: new Date(2026, 3, 10),
                receipt_type: "INCOME",
                receiptVats: { create: { rate: 24, net_amount: 100, vat_amount: 24, total: 124 } }
            }
        });
        await prisma.receipt.create({
            data: {
                document_id: dummy_document_id,
                user_id,
                vendor_name: "Sale B",
                total_amount: 62,
                receipt_date: new Date(2026, 3, 15),
                receipt_type: "INCOME",
                receiptVats: { create: { rate: 24, net_amount: 50, vat_amount: 12, total: 62 } }
            }
        });

        // Two deductible EXPENSE receipts sharing a VAT rate (merge branch), one with a
        // partial deductibility percentage to exercise the deduction math.
        await prisma.receipt.create({
            data: {
                document_id: dummy_document_id,
                user_id,
                vendor_name: "Purchase D",
                total_amount: 48,
                receipt_date: new Date(2026, 3, 12),
                receipt_type: "EXPENSE",
                is_deductible: true,
                vat_deductibility_percentage: 100,
                receiptVats: { create: { rate: 24, net_amount: 40, vat_amount: 8, total: 48 } }
            }
        });
        await prisma.receipt.create({
            data: {
                document_id: dummy_document_id,
                user_id,
                vendor_name: "Purchase E",
                total_amount: 30,
                receipt_date: new Date(2026, 3, 18),
                receipt_type: "EXPENSE",
                is_deductible: true,
                vat_deductibility_percentage: 50,
                receiptVats: { create: { rate: 24, net_amount: 20, vat_amount: 10, total: 30 } }
            }
        });

        // A non-deductible EXPENSE receipt, which must be skipped entirely.
        await prisma.receipt.create({
            data: {
                document_id: dummy_document_id,
                user_id,
                vendor_name: "Purchase F (not deductible)",
                total_amount: 1998,
                receipt_date: new Date(2026, 3, 20),
                receipt_type: "EXPENSE",
                is_deductible: false,
                receiptVats: { create: { rate: 24, net_amount: 999, vat_amount: 999, total: 1998 } }
            }
        });

        const receipts = await prisma.receipt.findMany({ where: { document_id: dummy_document_id } });
        expect(receipts).toHaveLength(5);
    });

    it('Recalculates the existing Q2 report using the created receipts', async () => {
        const response = await request(app)
            .post('/api/report')
            .set('Cookie', `token=${token}`)
            .send({ timePeriod: "Q2" });

        // Overwrites the existing draft Q2 report instead of creating a new one
        expect(response.status).toBe(200);
        expect(response.body.id).toBe(q2_report_id);
        expect(response.body).toMatchObject({
            sales_net: '150',
            sales_vat_amount: '36',
            sales_gross: '186',
            purchase_net: '60',
            purchase_vat_amount: '13',
            purchase_gross: '73',
            vat_payable: '23',
            vat_breakdown: {
                sales: [{ rate: 24, net: 150, vat_amount: 36, gross: 186 }],
                purchases: [{ rate: 24, net: 60, vat_amount: 13, gross: 73 }]
            }
        });
    });

    it('Gets the PDF for a report with sales and purchases', async () => {
        const response = await request(app)
            .get(`/api/report/${q2_report_id}/pdf`)
            .set('Cookie', `token=${token}`)
            .buffer(true)
            .parse((res, callback) => {
                const chunks: Buffer[] = [];
                res.on('data', (chunk) => chunks.push(chunk));
                res.on('end', () => callback(null, Buffer.concat(chunks)));
            });

        expect(response.status).toBe(200);
        expect(response.headers['content-disposition']).toContain(`vat-report-Q2-${q2_report_id}`);
        expect(response.body.slice(0, 4).toString()).toBe('%PDF');
    });

    it('Creates a new report when the previous report for the period was already declared', async () => {
        // q4_report_id was already marked as declared above, so this must not overwrite it
        await prisma.receipt.create({
            data: {
                document_id: dummy_document_id,
                user_id,
                vendor_name: "Purchase only (Q4)",
                total_amount: 120,
                receipt_date: new Date(2026, 10, 10),
                receipt_type: "EXPENSE",
                is_deductible: true,
                vat_deductibility_percentage: 100,
                receiptVats: { create: { rate: 24, net_amount: 100, vat_amount: 20, total: 120 } }
            }
        });

        const response = await request(app)
            .post('/api/report')
            .set('Cookie', `token=${token}`)
            .send({ timePeriod: "Q4" });

        expect(response.status).toBe(201);
        expect(response.body.id).not.toBe(q4_report_id);
        expect(response.body.vat_payable).toBe('-20');
        expect(response.body.vat_breakdown).toEqual({
            sales: [],
            purchases: [{ rate: 24, net: 100, vat_amount: 20, gross: 120 }]
        });
        q4_refund_report_id = response.body.id;
    });

    it('Gets the PDF for a refund report with only purchases', async () => {
        const response = await request(app)
            .get(`/api/report/${q4_refund_report_id}/pdf`)
            .set('Cookie', `token=${token}`)
            .buffer(true)
            .parse((res, callback) => {
                const chunks: Buffer[] = [];
                res.on('data', (chunk) => chunks.push(chunk));
                res.on('end', () => callback(null, Buffer.concat(chunks)));
            });

        expect(response.status).toBe(200);
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
        await prisma.receiptVat.deleteMany({ where: { receipt: { user_id } } });
        await prisma.receipt.deleteMany({ where: { user_id } });
        await prisma.document.deleteMany({ where: { user_id } });
        await prisma.vatReport.deleteMany({ where: { user_id } });
        if (user?.supabase_id) {
            await supabaseAdmin.auth.admin.deleteUser(user.supabase_id);
        }

        if (user_id) {
            await prisma.user.delete({ where: { id: user_id } });
        }
    });
});