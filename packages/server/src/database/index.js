import { DATABASE_URL } from "@chat/config";
import { PGlite } from "@electric-sql/pglite";

export const pgClient = new PGlite(DATABASE_URL);
