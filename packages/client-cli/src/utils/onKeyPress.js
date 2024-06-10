import { stdin } from "node:process";

export function onKeyPressController(keys) {
  const controller = new AbortController();

  const onKey = (str, key) => {
    if (keys.includes(key.name)) {
      console.log("escape pressed, aborting controller");
      controller.abort();
    }
  };

  stdin.on("keypress", onKey);

  return { controller, unsubscribe: () => stdin.off("keypress", onKey) };
}
