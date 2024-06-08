import crypto from "crypto";

const { randomBytes, timingSafeEqual } = crypto;

import { promisify } from "util";

const scrypt = promisify(crypto.scrypt);
const getSalt = () => randomBytes(16);
const keylen = 32;

export const getToken = () => randomBytes(32).toString("hex");

/**
 *
 * @param {string} password
 * @returns {Promise<string>}
 */
export async function hash(password) {
  const salt = getSalt();
  const passwordHash = await scrypt(password, salt, keylen);

  return `${salt.toString("hex")}:${passwordHash.toString("hex")}`;
}

/**
 *
 * @param {string} password
 * @param {string} hash
 * @returns {Promise<boolean>}
 */
export async function verify(password, hash) {
  const [salt, storedPassword] = hash.split(":");

  const hashedPassword = await scrypt(
    password,
    Buffer.from(salt, "hex"),
    keylen
  );

  return timingSafeEqual(Buffer.from(storedPassword, "hex"), hashedPassword);
}
