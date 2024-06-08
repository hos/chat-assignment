import { test } from "node:test";
import { hash, verify } from "../src/utils/hash.js";

test("must create hash and verify it", async () => {
  const password = "myPassword";
  const passwordHash = await hash(password);

  await verify(password, passwordHash);
});
