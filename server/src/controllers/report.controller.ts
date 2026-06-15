import { Request, Response, NextFunction } from "express";
import { prisma } from "../lib/prisma";
import { NotFoundError } from "../utils/error";
import PDFDocument from "pdfkit";
import { timePeriodSchema } from "../schemas/report.schema";
import { ValidationError } from "../utils/error";
import { VatReportPeriod } from "@prisma/client";
import { idSchema } from "../schemas/id.schema";

// Helper function to calculate the start and end dates based on the selected time period (quarterly, monthly, yearly)
const getDateRange = (timePeriod: string): { start: Date; end: Date } => {
    const now = new Date();
    const year = now.getFullYear();

    switch(timePeriod) {
        case "Q1": return { start: new Date(year, 0, 1), end: new Date(year, 2, 31) };
        case "Q2": return { start: new Date(year, 3, 1), end: new Date(year, 5, 30) };
        case "Q3": return { start: new Date(year, 6, 1), end: new Date(year, 8, 30) };
        case "Q4": return { start: new Date(year, 9, 1), end: new Date(year, 11, 31) };
        case "Monthly": return { start: new Date(year, now.getMonth(), 1), end: new Date(year, now.getMonth() + 1, 0) };
        default: return { start: new Date(year, 0, 1), end: new Date(year, 11, 31) }; // yearly
    }
};

// Controller for handling VAT report generation and retrieval. 
// It includes functions to create a new report based on a specified time period, get all reports for the authenticated user
export const createReport = async (req: Request, res: Response, next: NextFunction) => {
    const user = req.user;

    // Getting time period from request body and validating with zod
    const result = timePeriodSchema.safeParse(req.body);
    if(!result.success) {
        return next(new ValidationError(result.error.issues[0].message));
    }

    const { timePeriod } = result.data;

    try {
        const { start, end } = getDateRange(timePeriod);

        const receipts = await prisma.receipt.findMany({
            where: {
                user_id: user.id,
                receipt_date: { gte: start, lte: end }
            },
            include: { receiptVats: true }
        });

        // Group VAT entries by rate and type (income/expense) to prepare for report generation
        const groupVats = (type: "INCOME" | "EXPENSE") => {
            return receipts
                .filter(r => r.receipt_type === type)
                .flatMap(r => r.receiptVats)
                .reduce((acc: any[], vat) => {
                    const existing = acc.find(v => v.rate === vat.rate);
                    if (existing) {
                        existing.net += Number(vat.net_amount);
                        existing.vat_amount += Number(vat.vat_amount);
                        existing.gross += Number(vat.total);
                    } else {
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

        const sales = groupVats("INCOME");
        const purchases = groupVats("EXPENSE");

        // Calculate total VAT for sales and purchases to determine VAT payable or refundable
        const sales_vat_total = sales.reduce((sum, v) => sum + v.vat_amount, 0);
        const purchase_vat_total = purchases.reduce((sum, v) => sum + v.vat_amount, 0);
        const vat_payable = sales_vat_total - purchase_vat_total;

        // Create a new VAT report record in the database with the calculated values and breakdown
        const report = await prisma.vatReport.create({
            data: {
                user_id: user.id,
                period_start: start,
                period_end: end,
                period_type: timePeriod.toUpperCase() as VatReportPeriod,
                sales_net: sales.reduce((sum, v) => sum + v.net, 0),
                sales_vat_amount: sales_vat_total,
                sales_gross: sales.reduce((sum, v) => sum + v.gross, 0),
                purchase_net: purchases.reduce((sum, v) => sum + v.net, 0),
                purchase_vat_amount: purchase_vat_total,
                purchase_gross: purchases.reduce((sum, v) => sum + v.gross, 0),
                vat_payable,
                vat_breakdown: { sales, purchases }
            }
        });

        return res.status(201).json(report);

    } catch(error) {
        next(error);
    }
};

export const getReports = async (req: Request, res: Response, next: NextFunction) => {
    const user = req.user;

    try {
        const reports = await prisma.vatReport.findMany({ where: { user_id: user.id } });
        return res.status(200).json({ reports });
    } catch(error) {
        next(error)
    }
};

export const getReportById = async (req: Request<{id: string}>, res: Response, next: NextFunction) => {
    // Getting ID from params and validating with zod.
    const idResult = idSchema.safeParse(req.params);
    if (!idResult.success) {
        return next(new ValidationError(idResult.error.issues[0].message));
    }

    const { id } = idResult.data;
    
    try {
        const report = await prisma.vatReport.findUnique({ where: { id } });
        
        if (!report) {
            return next(new NotFoundError("Report not found"));
        }
        
        return res.status(200).json(report);
    } catch(error) {
        next(error);
    }
};

export const getReportPdf = async (req: Request<{id: string}>, res: Response, next: NextFunction) => {
    const user = req.user;
    // Getting ID from params and validating with zod.
    const idResult = idSchema.safeParse(req.params);
    if (!idResult.success) {
        return next(new ValidationError(idResult.error.issues[0].message));
    }
    
    const { id } = idResult.data;

    try {
        const report = await prisma.vatReport.findUnique({
            where: { id, user_id: user.id }
        });

        if (!report) {
            return next(new NotFoundError("Report not found"));
        }

        const vatBreakdown = report.vat_breakdown as {
            sales: { rate: number; net: number; vat_amount: number; gross: number }[];
            purchases: { rate: number; net: number; vat_amount: number; gross: number }[];
        };

        const doc = new PDFDocument({ margin: 50 });

        // Set response headers
        res.setHeader("Content-Type", "application/pdf");
        res.setHeader("Content-Disposition", `attachment; filename=vat-report-${report.period_type}-${id}.pdf`);
        doc.pipe(res);

        // Title
        doc.fontSize(20).font("Helvetica-Bold").text("VAT Report", { align: "center" });
        doc.moveDown(0.5);
        doc.fontSize(12).font("Helvetica").text(`Period: ${report.period_type}`, { align: "center" });
        doc.fontSize(10).text(
            `${new Date(report.period_start).toLocaleDateString("fi-FI")} – ${new Date(report.period_end).toLocaleDateString("fi-FI")}`,
            { align: "center" }
        );

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
        doc.fontSize(11).font("Helvetica-Bold").text(
            `${isRefund ? "VAT Refund" : "VAT Payable"}:      ${Math.abs(Number(report.vat_payable)).toFixed(2)} €`
        );

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

    } catch(error) {
        next(error);
    }
};