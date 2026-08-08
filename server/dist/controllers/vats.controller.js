"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getVatById = exports.getVatsByReceiptId = void 0;
const prisma_1 = require("../lib/prisma");
const error_1 = require("../utils/error");
const id_schema_1 = require("../schemas/id.schema");
const error_2 = require("../utils/error");
/**
 * Retrieves all VAT entries belonging to a receipt.
 * @param {Request} req.params - Receipt ID
 * @returns 200 with `{ vats }`
 * @throws {ValidationError} 400 - If receipt ID fails validation
 * @throws {ServerError} 500 - If database query fails
 */
const getVatsByReceiptId = async (req, res, next) => {
    // Getting id from params and validating with zod
    const result = id_schema_1.receiptIdSchema.safeParse(req.params);
    if (!result.success) {
        return next(new error_2.ValidationError(result.error.issues[0].message));
    }
    const { receipt_id } = result.data;
    try {
        const vats = await prisma_1.prisma.receiptVat.findMany({ where: { receipt_id: receipt_id, receipt: { user_id: req.user.id } } });
        return res.status(200).json({ vats });
    }
    catch (err) {
        return next(new error_1.ServerError("Internal server error"));
    }
};
exports.getVatsByReceiptId = getVatsByReceiptId;
/**
 * Retrieves a single VAT entry by ID.
 * @param {Request} req.params - VAT entry ID
 * @returns 200 with `{ vats }`
 * @throws {ValidationError} 400 - If VAT entry ID fails validation
 * @throws {ServerError} 500 - If database query fails
 */
const getVatById = async (req, res, next) => {
    // Getting id from params and validating with zod
    const result = id_schema_1.idSchema.safeParse(req.params);
    if (!result.success) {
        return next(new error_2.ValidationError(result.error.issues[0].message));
    }
    const { id } = result.data;
    try {
        const vats = await prisma_1.prisma.receiptVat.findUnique({ where: { id: id, receipt: { user_id: req.user.id } } });
        return res.status(200).json({ vats });
    }
    catch (err) {
        return next(new error_1.ServerError("Internal server error"));
    }
};
exports.getVatById = getVatById;
