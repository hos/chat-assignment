import { Readline, createInterface } from "node:readline/promises";
import { stdin as input, stdout as output } from "node:process";

export const ui = createInterface({ input, output });
export const rl = new Readline(output, { autoCommit: true });

class UIBuilder {
  output = output;
  input = input;
  ui = ui;
  rl = rl;

  // Persistent state across different screens, which they can share and modify.
  ctx = {};

  screens = [];
  history = [];

  baseCommands = [
    {
      cmd: "/e",
      description: "Exit the chat",
      action: () => process.exit(0),
    },
    {
      cmd: "/h",
      description: "Print help",
      action: this.printHelp.bind(this),
    },
    {
      cmd: "/b",
      description: "Back to previous screen",
      action: this.back.bind(this),
    },
    {
      cmd: "/c",
      description: "Print current state",
      action: this.printCurrentState.bind(this),
    },
    {
      cmd: "/clear",
      description: "Clear the screen",
      action: this.clearScreen.bind(this),
    },
    {
      cmd: "/terminate",
      description: "Clear the store",
      action: this.clearStore.bind(this),
    },
  ];

  constructor() {}

  async clearScreen() {
    rl.cursorTo(0, 0);
    await rl.commit();
    rl.clearScreenDown();
    await rl.commit();
  }

  async printLine(content, prompt = true) {
    if (prompt) {
      rl.cursorTo(0);
      await rl.commit();
      rl.clearLine(0);
      await rl.commit();
    }

    output.write(`${content}\n`);

    if (prompt) {
      output.write(this.prompt);
    }

    await rl.commit();
  }

  async clearStore() {
    await this.ctx.store.destroy();
    Object.assign(this.ctx, {});
  }

  get prompt() {
    return this.ctx.user ? `${this.ctx.user.username} > ` : " > ";
  }

  addScreen(
    screen = {
      name: "",
      description: "",
      // On user input, if the input is not a command or a screen name,
      // it will be passed to this function fo the current screen (history.at(-1)).
      handle: () => {},
      // When we switch to this screen, this function will be called,
      // it is responsible for screen to init and/or render everything it needs.
      render: () => {},
      // If function returns false, the screen will not be shown in the screen list.
      shouldShow: () => {},
    }
  ) {
    this.screens.push(screen);
    return this;
  }

  printCurrentState() {
    const currentScreen = this.getCurrentScreen();
    if (currentScreen) {
      output.write(
        `screen: ${currentScreen.name}, user: ${JSON.stringify(
          this.ctx.user.username
        )}\n`
      );
    }
  }

  getCurrentScreen() {
    // We always default to first screen, which must be the home screen.
    const name = this.history.at(-1) || this.screens.at(0).name;
    return this.screens.find((s) => s.name === name);
  }

  async back() {
    // Calling redirect without a screen name will pop the history.
    await this.redirect();
  }

  printHelp() {
    output.write("Commands:\n");
    this.baseCommands.forEach((c) => {
      output.write(`  ${c.cmd.padEnd(10, " ")} - ${c.description}\n`);
    });
    this.screens.forEach((s) => {
      if (typeof s.shouldShow === "function") {
        if (!s.shouldShow()) {
          return;
        }
      }
      output.write(`  ${s.name.padEnd(10, " ")} - ${s.description}\n`);
    });

    output.write(this.prompt);
  }

  async redirect(screenName) {
    const prevScreen = this.getCurrentScreen();

    // First, if current screen has resources to dispose, we dispose them.
    if (typeof prevScreen.dispose === "function") {
      await prevScreen.dispose();
    }

    if (!screenName) {
      // If screen is provided, we just pop the history, it means we are going back.
      this.history.pop();
    } else {
      // Otherwise we push the screen to the history.
      this.history.push(screenName);
    }

    const newScreen = this.getCurrentScreen();
    // This should not happen, we don't handle this case.
    if (!newScreen) {
      throw new Error(`Screen not found: ${screenName}`);
    }

    // Start a new screen, remove everything old.
    await this.clearScreen();
    await newScreen.render();

    return newScreen;
  }

  async run() {
    await this.redirect();

    do {
      const content = await ui.question(this.prompt);

      const cmd = this.baseCommands.find((c) => c.cmd === content);
      if (cmd) {
        await cmd.action();
        output.write(this.prompt);
        continue;
      }

      const screen = this.screens.find((s) => s.name === content);
      if (screen) {
        await this.redirect(content);
        continue;
      }

      const currentScreen = this.getCurrentScreen();
      if (currentScreen && typeof currentScreen.handle === "function") {
        await currentScreen.handle(content);
        continue;
      }
    } while (true);
  }
}

export const builder = new UIBuilder();
