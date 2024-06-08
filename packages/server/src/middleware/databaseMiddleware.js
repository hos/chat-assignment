import { pgClient } from "../database/index.js";

export async function databaseMiddleware(req, res, next) {
  req.pgClient = pgClient;
  next();
}
