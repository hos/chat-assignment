export const logger = console;

export function httpLogger() {
  return async (req, res, next) => {
    const start = Date.now();
    const { method, url, headers } = req;
    const ip = req.headers["x-forwarded-for"] || req.connection.remoteAddress;
    const userAgent = headers["user-agent"];
    const referer = headers["referer"];

    const user = [ip, userAgent, referer].filter(Boolean).join(" - ");

    res.on("finish", () => {
      const { statusCode } = res;
      const duration = Date.now() - start;
      logger.info(
        `${method} ${url} ${statusCode} ${duration}ms ${user}`
      );
    });

    next();
  };
}
