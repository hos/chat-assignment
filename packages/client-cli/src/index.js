import readline, { Readline } from "node:readline/promises";
import { setTimeout } from "node:timers/promises";
import { stdin as input, stdout as output } from "node:process";
import { ChatSDK } from "@chat/sdk";
import { io } from "socket.io-client";

const ui = readline.createInterface({ input, output });
const rl = new Readline(output);

const BASE_URL = "http://localhost:3024";

// This is longest username we can have.
const padSize = 12;

const sdk = new ChatSDK(BASE_URL);

/**
 * Here is an example of how to actually authenticate the user.
 */
// let userSession;
// do {
//   const username = await ui.question("What is your username? ");

//   // NOTE: for simplification we won't hide the password,
//   // but in a real application, you should not show what is typing the user here.
//   const password = await ui.question("What is your password? ");

//   // Ideally we will need to encrypt and store the token,
//   // so user don't need to login every time.
//   userSession = await sdk.login(username, password);

//   if (!userSession) {
//     ui.write("Invalid username or password, please try again.");
//   }
// } while (!userSession);

// But here we just hard code it.
const userSession = await sdk.login("jamesbond", "StrongIndependentPassword");

const socket = io(BASE_URL.replace("http", "ws"), {
  auth: {
    token: userSession.session.token,
  },
});

const logMessage = (msg) => {
  output.write(`${msg.username.padStart(padSize, " ")}: ${msg.content}\n`);
};

socket.on("connect", () => {
  output.write("✅ connected\n");
});

socket.on("error", () => {
  output.write("❌ failed to connect\n");
});

socket.on("disconnect", () => {
  output.write("⚙️ disconnected\n");
});

socket.on("message", (message) => {
  logMessage(message);
});

// Wait a bit, to print the connection status, then list the messages.
await setTimeout(500);

const messages = await sdk.listMessages();

messages.reverse().forEach((message) => {
  logMessage(message);
});

do {
  const content = await ui.question(" ".repeat(padSize) + ": ");

  rl.moveCursor(0, -1);
  rl.clearLine(0);
  rl.cursorTo(0);
  await rl.commit();

  if (!content.trim()) {
    continue;
  }

  if (content === "/exit") {
    break;
  }

  await sdk.createMessage(content);
} while (true);

ui.close();
