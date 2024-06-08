
export const PORT = process.env.PORT || 3024;

// If nothing is provided, PGlite will default to in memory database
// you can persist your database by providing a path to an existing directory.
// This is not actual postgres connection string, but just a directory path.
// like ../../data
export const DATABASE_URL = process.env.DATABASE_URL;
