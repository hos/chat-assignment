import Express from "express";
import { PORT } from "@chat/config";

import { logger } from "./utils/logger.js";
import { databaseMiddleware } from "./middleware/databaseMiddleware.js";
import { errorHandler } from "./middleware/errorHandler.js";

const app = Express();

app.use(databaseMiddleware);

app.use(errorHandler);

app.listen(PORT, () => {
  logger.info(`\n Server is running on http://localhost:${PORT} \n`);
});
