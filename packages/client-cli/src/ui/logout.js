import { builder } from "./builder.js";

builder.addScreen({
  shouldShow: () => {
    return !!builder.ctx.user;
  },
  name: "/logout",
  description: "Logout",
  async render() {
    builder.ctx.sdk.setToken(null);
    await builder.ctx.store.delete("token");
    delete builder.ctx.user

    builder.redirect();
  },

  async handle() {},
});
