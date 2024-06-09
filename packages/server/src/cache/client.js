import Redis from "ioredis";
import { logger } from "../utils/logger.js";

// We will support running application without redis,
// it is only used by socket.io, to allow us to scale the application,
// horizontally and distribute events across all instances of the server.
// So for example if user a is connected to server 1 and creates a message,
// the triggered event will be sent to all other servers, so they can broadcast it to their users.
export const redisClient = process.env.REDIS_URL
  ? new Redis(process.env.REDIS_URL, {
      connectTimeout: 10000,
      keepAlive: 10000,
    })
  : null;

const onError = (name) => (error) => {
  logger.error(`[${name}]`, error);
};

const onConnect = (name) => () => {
  logger.info(`[${name}]`, "connected to Redis");
};

export const pubClient = redisClient?.duplicate();
export const subClient = redisClient?.duplicate();

if (redisClient) {
  redisClient.on("error", onError);
  redisClient.on("connect", onConnect("default"));
}

if (pubClient) {
  pubClient.on("error", onError);
  redisClient.on("connect", onConnect("pubClient"));
}

if (subClient) {
  subClient.on("error", onError);
  redisClient.on("connect", onConnect("subClient"));
}
