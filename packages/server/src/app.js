import { PORT } from "@chat/config";
import bodyParser from "body-parser";
import { databaseMiddleware } from "./middleware/databaseMiddleware.js";
import { errorHandler } from "./middleware/errorHandler.js";
import { router } from "./routes/index.js";
import { createAdapter } from "@socket.io/redis-adapter";

import {
  authMiddleware,
  socketAuthMiddleware,
} from "./middleware/authMiddleware.js";
import { migrate } from "./database/index.js";
import { server, io, app } from "./server.js";
import { httpLogger, logger } from "./utils/logger.js";
import { pubClient, subClient } from "./cache/client.js";
import { router as healthRouter } from "./routes/health.js";

// This can be moved to a script, and executed upon deployment,
// instead of running it every time the server starts.
await migrate();

if (pubClient && subClient) {
  logger.info(`Using Redis for socket.io adapter.`);
  io.adapter(createAdapter(pubClient, subClient));
}

io.use(socketAuthMiddleware);

app.use(httpLogger());

app.use("/health", healthRouter);

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
