"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.receiptQuerySchema = exports.updateReceiptSchema = exports.deductibilityPercentageSchema = exports.isDeductibleSchema = exports.categorySchema = void 0;
const zod_1 = require("zod");
exports.categorySchema = zod_1.z.object({
    category: zod_1.z.string().min(3, "Invalid category")
});
exports.isDeductibleSchema = zod_1.z.object({
    isDeductible: zod_1.z.boolean()
});
exports.deductibilityPercentageSchema = zod_1.z.object({
    deductibilityPercentage: zod_1.z
        .number()
        .min(0, "Percentage must be at least 0")
        .max(100, "Percentage must be 100 or lower")
});
exports.updateReceiptSchema = zod_1.z.object({
    vendor_name: zod_1.z.string().min(1, "Vendor name is required"),
    total_amount: zod_1.z.number({ error: "Total amount must be a number" }).positive("Total amount must be positive"),
    receipt_date: zod_1.z.string().min(1, "Date is required"),
    vats: zod_1.z.array(zod_1.z.object({
        id: zod_1.z.string(),
        rate: zod_1.z.number(),
        net_amount: zod_1.z.number(),
        vat_amount: zod_1.z.number(),
        total: zod_1.z.number(),
    })).optional(),
});
exports.receiptQuerySchema = zod_1.z.object({
    page: zod_1.z.coerce.number().int().positive().default(1),
    limit: zod_1.z.coerce.number().int().positive().max(100).default(20),
    from: zod_1.z.string().optional(),
    to: zod_1.z.string().optional(),
    search: zod_1.z.string().optional(),
    category: zod_1.z.string().optional(),
    type: zod_1.z.enum(["EXPENSE", "INCOME"]).optional(),
});
