import crypto from "crypto";
import fs from "fs/promises";
import path from "path";
import { cwd } from "node:process";

function deriveKey(password, salt) {
  return crypto.pbkdf2Sync(password, salt, 100000, 32, "sha256");
}

function encrypt(text, key) {
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv("aes-256-cbc", key, iv);
  let encrypted = cipher.update(text, "utf8", "hex");
  encrypted += cipher.final("hex");
  return {
    iv: iv.toString("hex"),
    content: encrypted,
  };
}

function decrypt(encrypted, key) {
  const iv = Buffer.from(encrypted.iv, "hex");
  const decipher = crypto.createDecipheriv("aes-256-cbc", key, iv);
  let decrypted = decipher.update(encrypted.content, "hex", "utf8");
  decrypted += decipher.final("utf8");
  return decrypted;
}

async function save(tokenFilePath, password, salt, data) {
  const key = deriveKey(password, salt);
  const encrypted = encrypt(JSON.stringify(data), key);
  await fs.writeFile(tokenFilePath, JSON.stringify({ ...encrypted, salt }), {
    mode: 0o600,
  });
}

async function load(filePath, password) {
  const encrypted = await fs
    .readFile(filePath, "utf8")
    .then((data) => JSON.parse(data))
    // If the file don't exist, we return a new salt.
    .catch(() => ({ salt: crypto.randomBytes(16).toString("hex") }));

  const key = deriveKey(password, encrypted.salt);
  const data = encrypted.iv ? JSON.parse(decrypt(encrypted, key)) : {};

  return {
    salt: encrypted.salt,
    data,
  };
}

export class Store {
  #password;
  salt;
  filePath = path.join(cwd(), "secure.store");

  constructor(filePath, password, salt, data) {
    this.data = data;
    this.#password = password;
    if (filePath) {
      this.filePath = filePath;
    }
    this.salt = salt;
  }

  static async fromPassword(filePath, password) {
    const { data, salt } = await load(filePath, password);
    return new Store(filePath, password, salt, data);
  }

  async set(key, value) {
    const { data } = await load(this.filePath, this.#password);
    data[key] = value;
    await save(this.filePath, this.#password, this.salt, data);
  }

  async get(key) {
    // If running multiple instances, they may update the store,
    // so we want to always get updated data.
    const { data } = await load(this.filePath, this.#password);
    return data[key];
  }

  async delete(key) {
    const { data } = await load(this.filePath, this.#password);
    delete data[key];
    await save(this.filePath, this.#password, this.salt, data);
  }

  async destroy() {
    await save(this.filePath, this.#password, this.salt, {});
  }
}
