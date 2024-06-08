import { HttpError } from "../utils/HttpError.js";
import { logger } from "../utils/logger.js";

/**
 *
 * @param {Error|HttpError} err
 * @param {import('express').Request} req
 * @param {import('express').Response} res
 * @param {import('express').Handler} next
 */
export function errorHandler(err, req, res, next) {
  logger.error(err);

  if (err instanceof HttpError) {
    res.status(err.status).send(err.message);
    return;
  }

  // Add here more error types that you want to handle.

  res.status(500).send("Something went wrong");
}
