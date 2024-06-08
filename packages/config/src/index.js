
export const PORT = process.env.PORT || 3024;

// Currently we use a local database, but we could easily switch to a remote one
// by changing the DATABASE_URL environment variable and also using a client like
// pg, pg-promise, ORMs etc.
export const DATABASE_URL = process.env.DATABASE_URL || "../../data";
