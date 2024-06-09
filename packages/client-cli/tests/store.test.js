import { equal, match } from "assert";
import { describe, test } from "node:test";
import { Store } from "../src/store.js";
import fs from "fs/promises";

describe("store", () => {
  test("store and load", async (ctx) => {
    await fs.unlink("test.store").catch(() => {});

    const store1 = await Store.fromPassword("test.store", "password");
    const store2 = await Store.fromPassword("test.store", "password");

    await ctx.test("must set the value", async () => {
      await store1.set("key", "value");
      equal(await store1.get("key"), "value");
    });

    await ctx.test(
      "other store instance must have the same value",
      async () => {
        equal(await store2.get("key"), "value");
      }
    );

    await ctx.test(
      "second store instance must be able to update the value",
      async () => {
        await store2.set("key", "new");

        equal(await store2.get("key"), "new");
        equal(await store1.get("key"), "new");
      }
    );

    await ctx.test(
      "adding other value must not affect the first store",
      async () => {
        await store2.set("other", "value");

        equal(await store2.get("other"), "value");
        equal(await store1.get("other"), "value");

        equal(await store2.get("key"), "new");
        equal(await store1.get("key"), "new");
      }
    );

    await ctx.test("must be able to delete the value", async () => {
      await store1.delete("key");
      equal(await store1.get("key"), undefined);
    });

    await ctx.test("same store with invalid password must fail", async () => {
      try {
        await Store.fromPassword("test.store", "invalid");
      } catch (error) {
        match(error.message, /bad decrypt/);
      }
    });
  });

});
