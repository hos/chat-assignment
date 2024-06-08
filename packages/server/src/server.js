import Express from "express";
import { PORT } from "@chat/config";

import { logger } from "./utils/logger.js";
import { databaseMiddleware } from "./middleware/databaseMiddleware.js";
import { errorHandler } from "./middleware/errorHandler.js";
import { migrate } from "./database/index.js";

const app = Express();

// This can be moved to a script, and executed upon deployment,
// instead of running it every time the server starts.
await migrate();

app.use(databaseMiddleware);

app.use(errorHandler);

app.listen(PORT, () => {
  logger.info(`\n Server is running on http://localhost:${PORT} \n`);
});
