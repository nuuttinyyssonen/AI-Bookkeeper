import { Request, Response, NextFunction } from "express";
import { prisma } from "../lib/prisma";
import { NotFoundError } from "../utils/error";

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


export const createReport = async (req: Request, res: Response, next: NextFunction) => {
    const user = req.user;
    const { timePeriod } = req.body;

    try {
        const { start, end } = getDateRange(timePeriod);

        const receipts = await prisma.receipt.findMany({
            where: {
                user_id: user.id,
                receipt_date: { gte: start, lte: end }
            },
            include: { receiptVats: true }
        });

        // Muodosta VAT breakdown
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

        // Laske yhteissummat
        const sales_vat_total = sales.reduce((sum, v) => sum + v.vat_amount, 0);
        const purchase_vat_total = purchases.reduce((sum, v) => sum + v.vat_amount, 0);
        const vat_payable = sales_vat_total - purchase_vat_total;

        // Tallenna raportti tietokantaan
        const report = await prisma.vatReport.create({
            data: {
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
    const { id } = req.params;
    
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