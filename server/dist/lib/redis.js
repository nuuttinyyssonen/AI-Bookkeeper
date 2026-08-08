"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ioredis_1 = __importDefault(require("ioredis"));
const redisUrl = process.env.REDIS_URL || 'redis://localhost:6379';
// Different redis database for testing to avoid conflicts with development/production data
const redis = new ioredis_1.default(redisUrl, {
    db: process.env.NODE_ENV === "test" ? 1 : 0,
});
exports.default = redis;
