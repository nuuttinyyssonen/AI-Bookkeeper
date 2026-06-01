import "dotenv/config";
import { defineConfig, env } from "prisma/config";

const datasourceUrl = process.env.NODE_ENV === "test"
  ? env("DATABASE_URL_TEST")
  : env("DIRECT_URL");

export default defineConfig({
  schema: "prisma/schema.prisma",
  datasource: {
    url: datasourceUrl,
  },
});