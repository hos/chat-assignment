import { Router } from "express";
import z from "zod";
import { createUser, createUserSession } from "../database/index.js";
import { sanitize } from "../utils/sanitize.js";
import { HttpError } from "../utils/HttpError.js";
import { ZodPassword, ZodUsername } from "../utils/zod.js";
import { setTokenCookie } from "../middleware/authMiddleware.js";

export const router = Router();

router.get("/current", async function getCurrentUserHandler(req, res) {
  if (!req.user) {
    throw new HttpError(401, "Unauthorized");
  }

  res.json(sanitize({ user: req.user }));
});

const CreateUserSchema = z.object({
  body: z.object({
    username: ZodUsername,
    password: ZodPassword,
  }),
});

router.post("/", async function createUserHandler(req, res) {
  const { body } = CreateUserSchema.parse(req);
  const { username, password } = body;

  await createUser(username, password).catch((err) => {
    // We want to let the user know that the username is already taken.
    if (err.code === "23505") {
      throw new HttpError(400, "Username already taken");
    }
    throw err;
  });

  const session = await createUserSession(username, password);

  setTokenCookie(res, session.token);

  // If the client is not in the browser, it can use the token from the session
  // and store it as appropriate for that specific environment.
  res.json(sanitize(session));
});
