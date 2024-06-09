
export const PORT = process.env.PORT || 3024;

// If nothing is provided, PGlite will default to in memory database
// you can persist your database by providing a path to an existing directory.
// This is not actual postgres connection string, but just a directory path.
// like ../../data
export const DATABASE_URL = process.env.DATABASE_URL;

export const COOKIE_EXPIRY = 60 * 60 * 24 * 7; // 7 days


export const REDIS_URL = process.env.REDIS_URL
