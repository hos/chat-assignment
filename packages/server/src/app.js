import { PORT } from "@chat/config";
import bodyParser from "body-parser";
import { databaseMiddleware } from "./middleware/databaseMiddleware.js";
import { errorHandler } from "./middleware/errorHandler.js";
import { router } from "./routes/index.js";
import {
  authMiddleware,
  socketAuthMiddleware,
} from "./middleware/authMiddleware.js";
import { migrate } from "./database/index.js";
import { server, io, app } from "./server.js";
import { logger } from "./utils/logger.js";

// This can be moved to a script, and executed upon deployment,
// instead of running it every time the server starts.
await migrate();

io.use(socketAuthMiddleware);

app.use(bodyParser.json());

app.use(databaseMiddleware);
app.use(authMiddleware);

app.use("/api/v1", router);

app.use(errorHandler);

server.listen(PORT, () => {
  logger.info(
    `Server is running on
     http://localhost:${PORT}
     ws://localhost:${PORT}`
  );
});
