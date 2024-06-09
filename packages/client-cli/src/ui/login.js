import { builder } from "./builder.js";

builder.addScreen({
  shouldShow: () => {
    return !builder.ctx.user;
  },
  name: "/login",
  description: "Login",
  async render() {
    while (builder.ctx.user === undefined) {
      builder.output.write("🔑 Login\n");

      const username = await builder.ui.question("Username: ");
      const password = await builder.ui.question("Password: ");

      const data = await builder.ctx.sdk.login(username, password);

      if (data.message) {
        builder.output.write("❌ Login failed\n");
        builder.output.write(`  ${data.message}\n`);
        builder.ctx.store.delete("password");
        continue;
      }

      const token = data.session.token;
      await builder.ctx.store.set("token", token);
      builder.ctx.sdk.setToken(token);
      builder.ctx.user = data.user;
    }

    await builder.redirect();
  },
});
