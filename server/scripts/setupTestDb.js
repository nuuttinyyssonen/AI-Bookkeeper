const path = require("path");
const { spawnSync } = require("child_process");
const dotenv = require("dotenv");

process.env.NODE_ENV = "test";
const envPath = path.join(__dirname, "..", ".env");
const result = dotenv.config({ path: envPath });

if (result.error) {
  throw result.error;
}

const databaseUrl = process.env.DATABASE_URL_TEST;
if (!databaseUrl) {
  throw new Error("DATABASE_URL_TEST must be defined in .env for test DB setup.");
}

process.env.DATABASE_URL = databaseUrl;

const command = process.platform === "win32" ? "npx.cmd" : "npx";
const resultSync = spawnSync(command, ["prisma", "db", "push", "--schema", "prisma/schema.prisma"], {
  stdio: "inherit",
  cwd: path.join(__dirname, ".."),
  env: { ...process.env, NODE_ENV: "test" },
});

if (resultSync.error) {
  throw resultSync.error;
}

process.exit(resultSync.status);