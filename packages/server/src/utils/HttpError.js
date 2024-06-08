/**
 * Custom error class for HTTP errors, this instance will be used
 * to handle errors in the middleware and handlers. The provided status
 * will be used to set the status code of the response.
 */
export class HttpError extends Error {
  constructor(status, message) {
    super(message);
    this.status = status;
  }
}
