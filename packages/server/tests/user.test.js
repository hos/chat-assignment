import { describe, test } from "node:test";
import { equal } from "assert";
import {
  createUser,
  createUserSession,
  getUserByToken,
  migrate,
  verifyUserPassword,
} from "../src/database/index.js";

await migrate(true);

describe("user creation", () => {
  test("must create new user, with hashed password", async () => {
    const user = await createUser("myUser", "myPassword");

    equal(user.username, "myUser");
  });

  test("must be able to verify user password", async () => {
    const user = await verifyUserPassword("myUser", "myPassword");

    equal(typeof user, "object");
  });

  test("invalid password must fail", async () => {
    const user = await verifyUserPassword("myUser", "invalidPassword");

    equal(user, null);
  });
});

describe("user session", () => {
  test("must create session and get it with token", async () => {
    const userSession = await createUserSession("myUser", "myPassword");

    equal(typeof userSession?.session.token, "string");

    const { user } = await getUserByToken(userSession?.session.token);

    equal(user.username, "myUser");
  });
});
