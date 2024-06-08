import { describe, test, before } from "node:test";
import { ok, equal } from "assert";
import {
  createUser,
  createUserSession,
  getUserByToken,
  migrate,
  verifyUserPassword,
} from "../src/database/index.js";

before(async () => {
  await migrate(true);
});

describe("user creation", () => {
  test("must create new user, with hashed password", async () => {
    const user = await createUser("myUser", "myPassword");

    equal(user.username, "myUser");
  });

  test("must be able to verify user password", async () => {
    const user = await verifyUserPassword("myUser", "myPassword");

    ok(typeof user === "object");
  });

  test("invalid password must fail", async () => {
    const user = await verifyUserPassword("myUser", "invalidPassword");

    ok(user === null);
  });
});

describe("user session", () => {
  test("must create session and get it with token", async () => {
    const session = await createUserSession("myUser", "myPassword");

    ok(typeof session.token === "string");

    const user = await getUserByToken(session.token);

    ok(user.username === "myUser");
  });
});
