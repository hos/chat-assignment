import { builder } from "./builder.js";

builder.addScreen({
  shouldShow: () => {
    return !builder.ctx.user;
  },
  name: "/reg",
  description: "Register",
  async render() {
    while (!builder.ctx.user) {
      builder.output.write("🔑 Register\n");

      const username = await builder.ui.question("Username: ");
      const password = await builder.ui.question("Password: ");

      if (!builder.ctx.userSession) {
        const data = await builder.ctx.sdk.createUser(username, password);

        if (data.message) {
          builder.output.write("❌ Registration failed\n");
          builder.output.write(`  ${data.message}\n`);
          continue;
        }

        builder.ctx.user = data.user;
        await builder.ctx.store.set("token", data.session.token);
      }
    }

    await builder.redirect();
  },
});
