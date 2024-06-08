import { getUserByToken } from "../database/index.js";
import { HttpError } from "../utils/HttpError.js";

// This actually can be removed if we add cookie-parser to the project,
// in that case we can get the cookie from req.cookies.token.
function getTokenFromCookie(req) {
  return (req.cookie || req.headers.cookie)
    ?.split(";")
    .find((c) => c.startsWith("token="))
    ?.split("=")[1];
}

function getUserToken(req) {
  const token = req.headers.authorization || getTokenFromCookie(req);
  return token;
}

export async function authMiddleware(req, res, next) {
  const token = getUserToken(req);

  if (!token) {
    next();
    return;
  }

  const user = await getUserByToken(token);
  req.user = user;

  next();
}

export async function requireUser(req, res, next) {
  if (!req.user) {
    throw new HttpError(401, "Unauthorized");
  }

  next();
}

export function setTokenCookie(res, token) {
  res.setHeader(
    "Set-Cookie",
    `token=${token}; HttpOnly; Secure; SameSite=None`
  );
}
