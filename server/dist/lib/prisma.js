"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.prisma = void 0;
const client_1 = require("@prisma/client");
const adapter_pg_1 = require("@prisma/adapter-pg");
require("dotenv/config");
const isTest = process.env.NODE_ENV === "test";
const databaseUrl = isTest
    ? process.env.DATABASE_URL_TEST ?? process.env.DATABASE_URL
    : process.env.DATABASE_URL;
if (!databaseUrl) {
    throw new Error(`DATABASE_URL${isTest ? `_TEST` : ""} is not defined. ` +
        `Set ${isTest ? "DATABASE_URL_TEST" : "DATABASE_URL"} in your environment.`);
}
if (isTest) {
    process.env.DATABASE_URL = databaseUrl;
}
const prisma = isTest
    ? new client_1.PrismaClient({ adapter: new adapter_pg_1.PrismaPg(databaseUrl) })
    : new client_1.PrismaClient({ accelerateUrl: databaseUrl });
exports.prisma = prisma;
