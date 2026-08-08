"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.receiptIdSchema = exports.batchIdSchema = exports.idSchema = void 0;
const zod_1 = require("zod");
exports.idSchema = zod_1.z.object({
    id: zod_1.z.uuid("Invalid ID format")
});
exports.batchIdSchema = zod_1.z.object({
    batchId: zod_1.z.uuid("Invalid Batch ID format")
});
exports.receiptIdSchema = zod_1.z.object({
    receipt_id: zod_1.z.string().uuid("Invalid receipt ID")
});
