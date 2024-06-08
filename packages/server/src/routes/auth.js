import { Router } from "express";
import z from "zod";
import { ZodPassword, ZodUsername } from "../utils/zod.js";
import { createUserSession } from "../database/user.js";
import { setTokenCookie } from "../middleware/authMiddleware.js";
import { sanitize } from "../utils/sanitize.js";
import { HttpError } from "../utils/HttpError.js";

export const router = Router();

const LoginSchema = z.object({
  body: z.object({
    username: ZodUsername,
    password: ZodPassword,
  }),
});

router.post("/login", async function loginHandler(req, res) {
  const { body } = LoginSchema.parse(req);
  const { username, password } = body;

  const userSession = await createUserSession(username, password);

  if(userSession === null) {
    throw new HttpError(401, "Invalid username or password");
  }

  setTokenCookie(res, userSession.session.token);

  res.json(sanitize(userSession));
});
