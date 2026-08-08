"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.timePeriodSchema = void 0;
const zod_1 = require("zod");
exports.timePeriodSchema = zod_1.z.object({
    timePeriod: zod_1.z.string().min(2, "Invalid time period")
});
