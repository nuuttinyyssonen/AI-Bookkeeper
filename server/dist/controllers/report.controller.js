"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getReportPdfUrl = exports.getReportPdf = exports.updateReportVatDeclarationSent = exports.deleteReportById = exports.getReportById = exports.getReports = exports.createReport = void 0;
const prisma_1 = require("../lib/prisma");
const error_1 = require("../utils/error");
const pdfkit_1 = __importDefault(require("pdfkit"));
const report_schema_1 = require("../schemas/report.schema");
const error_2 = require("../utils/error");
const id_schema_1 = require("../schemas/id.schema");
const supabase_1 = require("../lib/supabase");
// Helper function to calculate the start and end dates based on the selected time period (quarterly, monthly, yearly)
const getDateRange = (timePeriod) => {
    const now = new Date();
    const year = now.getFullYear();
    switch (timePeriod) {
        case "Q1": return { start: new Date(year, 0, 1), end: new Date(year, 2, 31) };
        case "Q2": return { start: new Date(year, 3, 1), end: new Date(year, 5, 30) };
        case "Q3": return { start: new Date(year, 6, 1), end: new Date(year, 8, 30) };
        case "Q4": return { start: new Date(year, 9, 1), end: new Date(year, 11, 31) };
        case "Monthly": return { start: new Date(year, now.getMonth(), 1), end: new Date(year, now.getMonth() + 1, 0) };
        default: return { start: new Date(year, 0, 1), end: new Date(year, 11, 31) }; // yearly
    }
};
/**
 * Generates a VAT report for the given time period from the user's receipts, grouping
 * sales and purchase VAT by rate. Overwrites an existing undeclared draft for the same
 * period if one exists, otherwise creates a new report.
 * @param {Request} req.user - User from auth middleware
 * @param {Request} req.body - Time period to generate the report for (e.g. Q1, Monthly)
 * @returns 200 or 201 with the created/updated VAT report
 * @throws {ValidationError} 400 - If time period fails validation
 * @throws {Error} 500 - If database queries fail
 */
const createReport = async (req, res, next) => {
    const user = req.user;
    // Getting time period from request body and validating with zod
    const result = report_schema_1.timePeriodSchema.safeParse(req.body);
    if (!result.success) {
        return next(new error_2.ValidationError(result.error.issues[0].message));
    }
    const { timePeriod } = result.data;
    try {
        const { start, end } = getDateRange(timePeriod);
        const receipts = await prisma_1.prisma.receipt.findMany({
            where: {
                user_id: user.id,
                receipt_date: { gte: start, lte: end }
            },
            include: { receiptVats: true }
        });
        // Group VAT entries for sales (income receipts)
        const groupSaleVats = () => {
            return receipts
                .filter(r => r.receipt_type === "INCOME")
                .flatMap(r => r.receiptVats)
                .reduce((acc, vat) => {
                const existing = acc.find(v => v.rate === Number(vat.rate));
                if (existing) {
                    existing.net += Number(vat.net_amount);
                    existing.vat_amount += Number(vat.vat_amount);
                    existing.gross += Number(vat.total);
                }
                else {
                    acc.push({
                        rate: Number(vat.rate),
                        net: Number(vat.net_amount),
                        vat_amount: Number(vat.vat_amount),
                        gross: Number(vat.total)
                    });
                }
                return acc;
            }, []);
        };
        // Group VAT entries for purchases, respecting deductibility and vat_deductibility_percentage
        const groupPurchaseVats = () => {
            const acc = [];
            for (const receipt of receipts.filter(r => r.receipt_type === "EXPENSE")) {
                if (!receipt.is_deductible)
                    continue;
                const deductPct = Number(receipt.vat_deductibility_percentage) / 100;
                for (const vat of receipt.receiptVats) {
                    const net = Number(vat.net_amount);
                    const deductibleVat = Number(vat.vat_amount) * deductPct;
                    const gross = net + deductibleVat;
                    const existing = acc.find(v => v.rate === Number(vat.rate));
                    if (existing) {
                        existing.net += net;
                        existing.vat_amount += deductibleVat;
                        existing.gross += gross;
                    }
                    else {
                        acc.push({ rate: Number(vat.rate), net, vat_amount: deductibleVat, gross });
                    }
                }
            }
            return acc;
        };
        const sales = groupSaleVats();
        const purchases = groupPurchaseVats();
        // Calculate total VAT for sales and purchases to determine VAT payable or refundable
        const sales_vat_total = sales.reduce((sum, v) => sum + v.vat_amount, 0);
        const purchase_vat_total = purchases.reduce((sum, v) => sum + v.vat_amount, 0);
        const vat_payable = sales_vat_total - purchase_vat_total;
        const reportData = {
            user_id: user.id,
            period_start: start,
            period_end: end,
            period_type: timePeriod.toUpperCase(),
            sales_net: sales.reduce((sum, v) => sum + v.net, 0),
            sales_vat_amount: sales_vat_total,
            sales_gross: sales.reduce((sum, v) => sum + v.gross, 0),
            purchase_net: purchases.reduce((sum, v) => sum + v.net, 0),
            purchase_vat_amount: purchase_vat_total,
            purchase_gross: purchases.reduce((sum, v) => sum + v.gross, 0),
            vat_payable,
            vat_breakdown: { sales, purchases }
        };
        // If a report for this period already exists and hasn't been sent to Vero yet,
        // overwrite it in place instead of accumulating duplicate drafts. Reports that
        // were already declared are left untouched and a new one is created alongside them.
        const existingReport = await prisma_1.prisma.vatReport.findFirst({
            where: {
                user_id: user.id,
                period_type: reportData.period_type,
                period_start: start,
                period_end: end,
                vat_declaration_sent: false
            }
        });
        const report = existingReport
            ? await prisma_1.prisma.vatReport.update({ where: { id: existingReport.id }, data: reportData })
            : await prisma_1.prisma.vatReport.create({ data: reportData });
        return res.status(existingReport ? 200 : 201).json(report);
    }
    catch (error) {
        next(error);
    }
};
exports.createReport = createReport;
/**
 * Gets all VAT reports belonging to the authenticated user.
 * @param {Request} req.user - User from auth middleware
 * @returns 200 with `{ reports }`
 * @throws {Error} 500 - If database query fails
 */
const getReports = async (req, res, next) => {
    const user = req.user;
    try {
        const reports = await prisma_1.prisma.vatReport.findMany({ where: { user_id: user.id } });
        return res.status(200).json({ reports });
    }
    catch (error) {
        next(error);
    }
};
exports.getReports = getReports;
/**
 * Retrieves a single VAT report by ID.
 * @param {Request} req.params - Report ID
 * @returns 200 with the VAT report
 * @throws {ValidationError} 400 - If report ID fails validation
 * @throws {NotFoundError} 404 - If report not found
 * @throws {Error} 500 - If database query fails
 */
const getReportById = async (req, res, next) => {
    // Getting ID from params and validating with zod.
    const idResult = id_schema_1.idSchema.safeParse(req.params);
    if (!idResult.success) {
        return next(new error_2.ValidationError(idResult.error.issues[0].message));
    }
    const { id } = idResult.data;
    try {
        const report = await prisma_1.prisma.vatReport.findUnique({ where: { id, user_id: req.user.id } });
        if (!report) {
            return next(new error_1.NotFoundError("Report not found"));
        }
        return res.status(200).json(report);
    }
    catch (error) {
        next(error);
    }
};
exports.getReportById = getReportById;
/**
 * Deletes a VAT report by ID.
 * @param {Request} req.params - Report ID
 * @returns 200 with success message
 * @throws {ValidationError} 400 - If report ID fails validation
 * @throws {Error} 500 - If database delete fails
 */
const deleteReportById = async (req, res, next) => {
    // Getting ID from params and validating with zod.
    const idResult = id_schema_1.idSchema.safeParse(req.params);
    if (!idResult.success) {
        return next(new error_2.ValidationError(idResult.error.issues[0].message));
    }
    const { id } = idResult.data;
    try {
        await prisma_1.prisma.vatReport.delete({ where: { id, user_id: req.user.id } });
        return res.status(200).json({ message: "report deleted successfully" });
    }
    catch (error) {
        next(error);
    }
};
exports.deleteReportById = deleteReportById;
/**
 * Marks a VAT report as having been declared/sent to Vero.
 * @param {Request} req.params - Report ID
 * @returns 200 with success message
 * @throws {ValidationError} 400 - If report ID fails validation
 * @throws {Error} 500 - If database update fails
 */
const updateReportVatDeclarationSent = async (req, res, next) => {
    // Getting ID from params and validating with zod.
    const idResult = id_schema_1.idSchema.safeParse(req.params);
    if (!idResult.success) {
        return next(new error_2.ValidationError(idResult.error.issues[0].message));
    }
    const { id } = idResult.data;
    try {
        await prisma_1.prisma.vatReport.update({
            where: { id, user_id: req.user.id },
            data: { vat_declaration_sent: true },
        });
        return res.status(200).json({ message: "report updated successfully" });
    }
    catch (error) {
        next(error);
    }
};
exports.updateReportVatDeclarationSent = updateReportVatDeclarationSent;
/**
 * Generates and streams a PDF summary of a VAT report, including sales and purchase
 * VAT breakdowns by rate.
 * @param {Request} req.params - Report ID
 * @param {Request} req.user - User from auth middleware
 * @returns Streams a PDF file as an attachment
 * @throws {ValidationError} 400 - If report ID fails validation
 * @throws {NotFoundError} 404 - If report not found or does not belong to user
 * @throws {Error} 500 - If database query or PDF generation fails
 */
const getReportPdf = async (req, res, next) => {
    const user = req.user;
    // Getting ID from params and validating with zod.
    const idResult = id_schema_1.idSchema.safeParse(req.params);
    if (!idResult.success) {
        return next(new error_2.ValidationError(idResult.error.issues[0].message));
    }
    const { id } = idResult.data;
    try {
        const report = await prisma_1.prisma.vatReport.findUnique({
            where: { id, user_id: user.id }
        });
        if (!report) {
            return next(new error_1.NotFoundError("Report not found"));
        }
        const vatBreakdown = report.vat_breakdown;
        const doc = new pdfkit_1.default({ margin: 50 });
        // Set response headers
        res.setHeader("Content-Type", "application/pdf");
        res.setHeader("Content-Disposition", `attachment; filename=vat-report-${report.period_type}-${id}.pdf`);
        doc.pipe(res);
        // Title
        doc.fontSize(20).font("Helvetica-Bold").text("VAT Report", { align: "center" });
        doc.moveDown(0.5);
        doc.fontSize(12).font("Helvetica").text(`Period: ${report.period_type}`, { align: "center" });
        doc.fontSize(10).text(`${new Date(report.period_start).toLocaleDateString("fi-FI")} – ${new Date(report.period_end).toLocaleDateString("fi-FI")}`, { align: "center" });
        doc.moveDown(1.5);
        doc.moveTo(50, doc.y).lineTo(550, doc.y).stroke();
        doc.moveDown(1);
        // Summary
        doc.fontSize(14).font("Helvetica-Bold").text("Summary");
        doc.moveDown(0.5);
        doc.fontSize(10).font("Helvetica");
        doc.text(`Sales VAT:        ${Number(report.sales_vat_amount).toFixed(2)} €`);
        doc.text(`Purchase VAT:     ${Number(report.purchase_vat_amount).toFixed(2)} €`);
        doc.moveDown(0.3);
        const isRefund = Number(report.vat_payable) < 0;
        doc.fontSize(11).font("Helvetica-Bold").text(`${isRefund ? "VAT Refund" : "VAT Payable"}:      ${Math.abs(Number(report.vat_payable)).toFixed(2)} €`);
        doc.moveDown(1.5);
        // Sales breakdown table
        doc.fontSize(13).font("Helvetica-Bold").text("Sales VAT Breakdown");
        doc.moveDown(0.5);
        const col1 = 50, col2 = 150, col3 = 280, col4 = 410;
        doc.fontSize(9).font("Helvetica-Bold");
        doc.text("VAT Rate", col1, doc.y, { width: 100 });
        doc.text("Net", col2, doc.y - doc.currentLineHeight(), { width: 130 });
        doc.text("VAT Amount", col3, doc.y - doc.currentLineHeight(), { width: 130 });
        doc.text("Gross", col4, doc.y - doc.currentLineHeight(), { width: 100 });
        doc.moveDown(0.3);
        doc.moveTo(50, doc.y).lineTo(550, doc.y).stroke();
        doc.moveDown(0.3);
        doc.font("Helvetica").fontSize(9);
        vatBreakdown.sales.forEach(row => {
            doc.text(`${row.rate}%`, col1, doc.y, { width: 100 });
            doc.text(`${row.net.toFixed(2)} €`, col2, doc.y - doc.currentLineHeight(), { width: 130 });
            doc.text(`${row.vat_amount.toFixed(2)} €`, col3, doc.y - doc.currentLineHeight(), { width: 130 });
            doc.text(`${row.gross.toFixed(2)} €`, col4, doc.y - doc.currentLineHeight(), { width: 100 });
            doc.moveDown(0.3);
        });
        doc.moveDown(1);
        // Purchases breakdown table
        doc.fontSize(13).font("Helvetica-Bold").text("Purchase VAT Breakdown");
        doc.moveDown(0.5);
        doc.fontSize(9).font("Helvetica-Bold");
        doc.text("VAT Rate", col1, doc.y, { width: 100 });
        doc.text("Net", col2, doc.y - doc.currentLineHeight(), { width: 130 });
        doc.text("VAT Amount", col3, doc.y - doc.currentLineHeight(), { width: 130 });
        doc.text("Gross", col4, doc.y - doc.currentLineHeight(), { width: 100 });
        doc.moveDown(0.3);
        doc.moveTo(50, doc.y).lineTo(550, doc.y).stroke();
        doc.moveDown(0.3);
        doc.font("Helvetica").fontSize(9);
        vatBreakdown.purchases.forEach(row => {
            doc.text(`${row.rate}%`, col1, doc.y, { width: 100 });
            doc.text(`${row.net.toFixed(2)} €`, col2, doc.y - doc.currentLineHeight(), { width: 130 });
            doc.text(`${row.vat_amount.toFixed(2)} €`, col3, doc.y - doc.currentLineHeight(), { width: 130 });
            doc.text(`${row.gross.toFixed(2)} €`, col4, doc.y - doc.currentLineHeight(), { width: 100 });
            doc.moveDown(0.3);
        });
        doc.moveDown(1);
        doc.moveTo(50, doc.y).lineTo(550, doc.y).stroke();
        doc.moveDown(0.5);
        doc.fontSize(9).font("Helvetica").fillColor("#666666")
            .text(`Generated: ${new Date().toLocaleDateString("fi-FI")}`, { align: "right" });
        doc.end();
    }
    catch (error) {
        next(error);
    }
};
exports.getReportPdf = getReportPdf;
/**
 * Generates a PDF summary of a VAT report and uploads it to Supabase storage,
 * returning a signed URL for mobile download.
 * @param {Request} req.params - Report ID
 * @param {Request} req.user - User from auth middleware
 * @returns { url: string } Signed Supabase URL valid for 1 hour
 * @throws {ValidationError} 400 - If report ID fails validation
 * @throws {NotFoundError} 404 - If report not found or does not belong to user
 * @throws {ServerError} 500 - If PDF generation or Supabase upload fails
 */
const getReportPdfUrl = async (req, res, next) => {
    const user = req.user;
    const idResult = id_schema_1.idSchema.safeParse(req.params);
    if (!idResult.success) {
        return next(new error_2.ValidationError(idResult.error.issues[0].message));
    }
    const { id } = idResult.data;
    try {
        const report = await prisma_1.prisma.vatReport.findUnique({
            where: { id, user_id: user.id }
        });
        if (!report) {
            return next(new error_1.NotFoundError("Report not found"));
        }
        const vatBreakdown = report.vat_breakdown;
        const pdfBuffer = await new Promise((resolve, reject) => {
            const doc = new pdfkit_1.default({ margin: 50 });
            const chunks = [];
            doc.on("data", (chunk) => chunks.push(Buffer.from(chunk)));
            doc.on("end", () => resolve(Buffer.concat(chunks)));
            doc.on("error", reject);
            // Title
            doc.fontSize(20).font("Helvetica-Bold").text("VAT Report", { align: "center" });
            doc.moveDown(0.5);
            doc.fontSize(12).font("Helvetica").text(`Period: ${report.period_type}`, { align: "center" });
            doc.fontSize(10).text(`${new Date(report.period_start).toLocaleDateString("fi-FI")} – ${new Date(report.period_end).toLocaleDateString("fi-FI")}`, { align: "center" });
            doc.moveDown(1.5);
            doc.moveTo(50, doc.y).lineTo(550, doc.y).stroke();
            doc.moveDown(1);
            // Summary
            doc.fontSize(14).font("Helvetica-Bold").text("Summary");
            doc.moveDown(0.5);
            doc.fontSize(10).font("Helvetica");
            doc.text(`Sales VAT:        ${Number(report.sales_vat_amount).toFixed(2)} €`);
            doc.text(`Purchase VAT:     ${Number(report.purchase_vat_amount).toFixed(2)} €`);
            doc.moveDown(0.3);
            const isRefund = Number(report.vat_payable) < 0;
            doc.fontSize(11).font("Helvetica-Bold").text(`${isRefund ? "VAT Refund" : "VAT Payable"}:      ${Math.abs(Number(report.vat_payable)).toFixed(2)} €`);
            doc.moveDown(1.5);
            const col1 = 50, col2 = 150, col3 = 280, col4 = 410;
            // Sales breakdown
            doc.fontSize(13).font("Helvetica-Bold").text("Sales VAT Breakdown");
            doc.moveDown(0.5);
            doc.fontSize(9).font("Helvetica-Bold");
            doc.text("VAT Rate", col1, doc.y, { width: 100 });
            doc.text("Net", col2, doc.y - doc.currentLineHeight(), { width: 130 });
            doc.text("VAT Amount", col3, doc.y - doc.currentLineHeight(), { width: 130 });
            doc.text("Gross", col4, doc.y - doc.currentLineHeight(), { width: 100 });
            doc.moveDown(0.3);
            doc.moveTo(50, doc.y).lineTo(550, doc.y).stroke();
            doc.moveDown(0.3);
            doc.font("Helvetica").fontSize(9);
            vatBreakdown.sales.forEach(row => {
                doc.text(`${row.rate}%`, col1, doc.y, { width: 100 });
                doc.text(`${row.net.toFixed(2)} €`, col2, doc.y - doc.currentLineHeight(), { width: 130 });
                doc.text(`${row.vat_amount.toFixed(2)} €`, col3, doc.y - doc.currentLineHeight(), { width: 130 });
                doc.text(`${row.gross.toFixed(2)} €`, col4, doc.y - doc.currentLineHeight(), { width: 100 });
                doc.moveDown(0.3);
            });
            doc.moveDown(1);
            // Purchases breakdown
            doc.fontSize(13).font("Helvetica-Bold").text("Purchase VAT Breakdown");
            doc.moveDown(0.5);
            doc.fontSize(9).font("Helvetica-Bold");
            doc.text("VAT Rate", col1, doc.y, { width: 100 });
            doc.text("Net", col2, doc.y - doc.currentLineHeight(), { width: 130 });
            doc.text("VAT Amount", col3, doc.y - doc.currentLineHeight(), { width: 130 });
            doc.text("Gross", col4, doc.y - doc.currentLineHeight(), { width: 100 });
            doc.moveDown(0.3);
            doc.moveTo(50, doc.y).lineTo(550, doc.y).stroke();
            doc.moveDown(0.3);
            doc.font("Helvetica").fontSize(9);
            vatBreakdown.purchases.forEach(row => {
                doc.text(`${row.rate}%`, col1, doc.y, { width: 100 });
                doc.text(`${row.net.toFixed(2)} €`, col2, doc.y - doc.currentLineHeight(), { width: 130 });
                doc.text(`${row.vat_amount.toFixed(2)} €`, col3, doc.y - doc.currentLineHeight(), { width: 130 });
                doc.text(`${row.gross.toFixed(2)} €`, col4, doc.y - doc.currentLineHeight(), { width: 100 });
                doc.moveDown(0.3);
            });
            doc.moveDown(1);
            doc.moveTo(50, doc.y).lineTo(550, doc.y).stroke();
            doc.moveDown(0.5);
            doc.fontSize(9).font("Helvetica").fillColor("#666666")
                .text(`Generated: ${new Date().toLocaleDateString("fi-FI")}`, { align: "right" });
            doc.end();
        });
        const fileName = `vat-report-${report.period_type}-${id}.pdf`;
        await supabase_1.supabaseAdmin.storage.from("reports").upload(fileName, pdfBuffer, {
            contentType: "application/pdf",
            upsert: true,
        });
        const { data, error } = await supabase_1.supabaseAdmin.storage
            .from("reports")
            .createSignedUrl(fileName, 3600);
        if (error)
            return next(new error_2.ServerError("Failed to generate URL"));
        return res.json({ url: data.signedUrl });
    }
    catch (error) {
        next(error);
    }
};
exports.getReportPdfUrl = getReportPdfUrl;
