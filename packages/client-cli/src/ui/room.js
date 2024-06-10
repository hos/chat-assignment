import { io } from "socket.io-client";
import { builder } from "./builder.js";

builder.addScreen({
  shouldShow: () => {
    return !!builder.ctx.user;
  },
  name: "/room",
  description: "Chat room",
  async render() {
    if (!builder.ctx.sdk) {
      await builder.redirect("/home");
      return;
    }

    if (!builder.ctx.user) {
      builder.redirect("/home");
    }

    if (!builder.ctx.socket || !builder.ctx.socket.connected) {
      const token = await builder.ctx.store.get("token");
      builder.ctx.socket = io(builder.ctx.baseUrl.replace("http", "ws"), {
        auth: { token },
      });

      builder.ctx.socket.on("connect", () => {
        builder.printLine("✅ connected", true);
      });

      builder.ctx.socket.on("error", () => {
        builder.printLine("❌ failed to connect", true);
      });

      builder.ctx.socket.on("disconnect", () => {
        builder.printLine("⚙️ disconnected", true);
      });

      builder.ctx.socket.on("message", async (message) => {
        builder.printLine(`${message.username}: ${message.content}`, true);
      });
    }

    await this.loadMessages();
  },

  dispose() {
    if (builder.ctx.socket) {
      builder.ctx.socket.disconnect();
    }
  },

  async loadMessages() {
    const messages = await builder.ctx.sdk.listMessages();
    messages.reverse().forEach((message) => {
      builder.output.write(`${message.username}: ${message.content}\n`);
    });
  },

  async handle(content) {
    builder.rl.moveCursor(0, -1);
    await builder.rl.commit();
    builder.rl.clearLine(0);
    await builder.rl.commit();

    if (!content?.trim()) {
      return;
    }

    await builder.ctx.sdk.createMessage(content);
  },
});
