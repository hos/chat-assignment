import Express from "express";
import { PORT } from "@chat/config";

import { logger } from "./utils/logger.js";

const app = Express();

app.listen(PORT, () => {
  logger.info(`\n Server is running on http://localhost:${PORT} \n`)
});
