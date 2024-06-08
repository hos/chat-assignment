import { Router } from "express";

import { router as usersRouter } from "./users.js";
import { router as authRouter } from "./auth.js";

export const router = Router();

router.use("/auth", authRouter);
router.use("/users", usersRouter);
