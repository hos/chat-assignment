import { createRoom } from "../database/room.js";

export async function roomMiddleware(req, res, next) {
  if (req.app.get("room")) {
    return next();
  }

  const room = await createRoom({ name: "main" });

  req.app.set("room", room);

  next();
}

export function getMainRoom(req) {
  return req.app.get("room");
}
