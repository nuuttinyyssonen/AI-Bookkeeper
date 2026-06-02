import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { withAccelerate } from "@prisma/extension-accelerate";
import "dotenv/config";

const isTest = process.env.NODE_ENV === "test";
const databaseUrl = isTest
  ? process.env.DATABASE_URL_TEST ?? process.env.DATABASE_URL
  : process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error(
    `DATABASE_URL${isTest ? `_TEST` : ""} is not defined. ` +
      `Set ${isTest ? "DATABASE_URL_TEST" : "DATABASE_URL"} in your environment.`
  );
}

if (isTest) {
  process.env.DATABASE_URL = databaseUrl;
}

const prisma = isTest
  ? new PrismaClient({ adapter: new PrismaPg(databaseUrl) })
  : new PrismaClient({ accelerateUrl: databaseUrl });

export { prisma };