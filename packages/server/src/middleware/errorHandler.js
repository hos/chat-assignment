import { ZodError } from "zod";
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
    res.status(err.status).send({ message: err.message });
    return;
  }

  // Inside handlers, when we validate user input using Zod, it will
  // throw an error, so we handle it here and tell the user what went wrong.
  if (err instanceof ZodError) {
    res.status(400).send({ message: err.message, errors: err.errors });
    return;
  }

  res.status(500).send({ message: "Something went wrong" });
}
