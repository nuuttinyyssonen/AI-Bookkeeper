"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCashFlowData = exports.getDashboardData = void 0;
const prisma_1 = require("../lib/prisma");
/**
 * Retrieves dashboard summary data for the authenticated user.
 * Aggregates total revenue, expenses, and net profit for the current year,
 * and returns the 5 most recent receipts.
 * @param {Request} req.user - User from auth middleware
 * @returns 200 with `{ revenue, expenses, net_profit, recent_receipts }`
 * @throws {Error} 500 - If database queries fail
 */
const getDashboardData = async (req, res, next) => {
    const user = req.user;
    try {
        // Get total revenue, expenses and net profit for the current year
        const revenue = await prisma_1.prisma.receipt.aggregate({
            where: {
                user_id: user.id,
                receipt_type: "INCOME",
                receipt_date: {
                    gte: new Date(new Date().getFullYear(), 0, 1),
                    lte: new Date(new Date().getFullYear(), 11, 31)
                }
            },
            _sum: {
                total_amount: true
            }
        });
        // Get total expenses for the current year
        const expenses = await prisma_1.prisma.receipt.aggregate({
            where: {
                user_id: user.id,
                receipt_type: "EXPENSE",
                receipt_date: {
                    gte: new Date(new Date().getFullYear(), 0, 1),
                    lte: new Date(new Date().getFullYear(), 11, 31)
                }
            },
            _sum: {
                total_amount: true
            }
        });
        // Get 5 most recent receipts for the user
        const recent_receipts = await prisma_1.prisma.receipt.findMany({
            where: {
                user_id: user.id
            },
            orderBy: {
                receipt_date: "desc"
            },
            take: 5,
            include: {
                receiptVats: true
            }
        });
        const net_profit = (revenue._sum.total_amount ?? 0) - (expenses._sum.total_amount ?? 0);
        return res.status(200).json({ revenue, expenses, net_profit, recent_receipts });
    }
    catch (error) {
        next(error);
    }
};
exports.getDashboardData = getDashboardData;
/**
 * Retrieves monthly cash flow data for the authenticated user over the last 6 months.
 * Groups income and expenses by month for chart visualization.
 * @param {Request} req.user - User from auth middleware
 * @returns 200 with `{ cashflow }` array of monthly income and expense totals
 * @throws {Error} 500 - If database queries fail
 */
const getCashFlowData = async (req, res, next) => {
    const user = req.user;
    try {
        // Get cash flow data for the last 6 months, grouped by month
        const months = Array.from({ length: 6 }, (_, i) => {
            const date = new Date();
            date.setDate(1);
            date.setMonth(date.getMonth() - i);
            return {
                year: date.getFullYear(),
                month: date.getMonth()
            };
        }).reverse();
        // For each month, calculate total income and expenses
        const cashflow = await Promise.all(months.map(async ({ year, month }) => {
            const start = new Date(year, month, 1);
            const end = new Date(year, month + 1, 0);
            const [income, expense] = await Promise.all([
                prisma_1.prisma.receipt.aggregate({
                    where: {
                        user_id: user.id,
                        receipt_type: "INCOME",
                        receipt_date: { gte: start, lte: end }
                    },
                    _sum: { total_amount: true }
                }),
                prisma_1.prisma.receipt.aggregate({
                    where: {
                        user_id: user.id,
                        receipt_type: "EXPENSE",
                        receipt_date: { gte: start, lte: end }
                    },
                    _sum: { total_amount: true }
                })
            ]);
            return {
                month: start.toLocaleString("fi-FI", { month: "short" }),
                income: income._sum.total_amount ?? 0,
                expense: expense._sum.total_amount ?? 0
            };
        }));
        return res.status(200).json({ cashflow });
    }
    catch (error) {
        next(error);
    }
};
exports.getCashFlowData = getCashFlowData;
