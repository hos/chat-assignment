import { loadEnvFile } from "node:process";
import { stat } from "node:fs/promises";
import { resolve } from "node:path";

const env = process.env.NODE_ENV || "development";
const rootDir = resolve("../../");
const optionalEnvFile = resolve(rootDir, `${env}.env`);

// First we load more specific env files, configured in `development.env` or `production.env`.
try {
  await stat(optionalEnvFile);
  console.log(`\nLoading environment variables from ${optionalEnvFile}\n`);
  loadEnvFile(optionalEnvFile);
} catch (error) {
  if (error.code !== "ENOENT") {
    throw error;
  }
}

// When more specific file is loaded, we load generic env, which won't override what we already loaded.
loadEnvFile(resolve(rootDir, ".env"));

export const PORT = process.env.PORT || 3024;

// If nothing is provided, PGlite will default to in memory database
// you can persist your database by providing a path to an existing directory.
// This is not actual postgres connection string, but just a directory path.
// like ../../data
export const DATABASE_URL = process.env.DATABASE_URL;

export const COOKIE_EXPIRY = 60 * 60 * 24 * 7; // 7 days

export const REDIS_URL = process.env.REDIS_URL;
