import { DATABASE_URL } from "@chat/config";
import pg from "pg";

import { PGlite } from "@electric-sql/pglite";

export const pgClient =
  DATABASE_URL === "in-memory"
    ? new PGlite()
    : new pg.Pool({
        connectionString: DATABASE_URL,
        // TODO: Remove this when we have a proper SSL certificate or
        // allow to configure this from the environment
        ssl: { rejectUnauthorized: false },
      });
