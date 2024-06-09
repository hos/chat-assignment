import { ChatSDK } from "@chat/sdk";
import { builder } from "./builder.js";
import { Store } from "../store.js";

const BASE_URL = "http://localhost:3024";

builder.addScreen({
  name: "/home",
  description: "Welcome to home!",
  async render() {
    // Get a password from the user and create a new store, encrypted with that password.
    while (!builder.ctx.store) {
      builder.output.write("🔐 Unlock Store\n");
      const storePassword = await builder.ui.question("Pin: ");
      if (!storePassword) {
        builder.output.write("❌ Pin is required\n");
        continue;
      }
      // Clear the screen after the password is entered.
      await builder.clearScreen();
      const store = await Store.fromPassword("secure.store", storePassword);
      builder.ctx.store = store;
    }

    // Initialize baseUrl, all the other resources must use it from here.
    const baseUrl =
      (await builder.ctx.store.get("baseUrl")) ||
      (await builder.ui.question(`Base URL: (default ${BASE_URL})`)) ||
      BASE_URL;

    builder.ctx.baseUrl = baseUrl;
    await builder.ctx.store.set("baseUrl", baseUrl);

    if (!builder.ctx.sdk) {
      builder.ctx.sdk = new ChatSDK(baseUrl);
    }

    // If there is a session in the store, try to login with it.
    const token = await builder.ctx.store.get("token");

    if (token) {
      builder.ctx.sdk.setToken(token);
      const data = await builder.ctx.sdk.getCurrentUser();
      // If it fails to get the user, the token is invalid,
      // clear the store, and the context and redirect to the home.
      if (data.message) {
        builder.output.write(`❌ Token invalid: ${data.message}\n`);
        await builder.ctx.store.delete("token");
        delete builder.ctx.user;
        await builder.redirect();
        return;
      }

      builder.ctx.user = data.user;
    }

    builder.printHelp();
  },

  async handle() {},
});
