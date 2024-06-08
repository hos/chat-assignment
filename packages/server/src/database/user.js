import { getToken, hash, verify } from "../utils/hash.js";
import { pgClient } from "./client.js";

/**
 * @typedef {Object} User
 * @property {string} username
 * @property {string} password_hash
 * @property {Date} created_at
 */

/**
 * @typedef {Object} Session
 * @property {number} id
 * @property {string} token
 * @property {Date} created_at
 */

/**
 *
 * @param {string} username
 * @returns {Promise<null | User>}
 */
export async function getUserByUsername(username) {
  const {
    rows: [user],
  } = await pgClient.query(`select * from users where username = $1;`, [
    username,
  ]);

  return user;
}

/**
 *
 * @param {string} username
 * @param {string} password
 * @returns {Promise<User>}
 */
export async function createUser(username, password) {
  const passwordHash = await hash(password);

  const {
    rows: [user],
  } = await pgClient.query(
    `insert into users (username, password_hash)
      values ($1, $2)
      returning id, username, created_at;`,
    [username, passwordHash]
  );

  return user;
}

/**
 * @param {string} username
 * @param {string} password
 * @returns {Promise<null | User>}
 */
export async function verifyUserPassword(username, password) {
  const user = await getUserByUsername(username);

  if (!user) {
    return null;
  }

  const isVerified = await verify(password, user.password_hash);
  if (isVerified) {
    return user;
  }

  return null;
}

/**
 * @param {string} username
 * @param {string} password
 * @returns {Promise<null | Session>}
 */
export async function createUserSession(username, password) {
  const user = await getUserByUsername(username);

  if (!user) {
    return null;
  }

  const verified = await verify(password, user.password_hash);

  if (!verified) {
    return null;
  }

  const token = await getToken();

  const {
    rows: [session],
  } = await pgClient.query(
    `insert into tokens (user_id, token)
      values ($1, $2)
      returning id, token, created_at;`,
    [user.id, token]
  );

  return session;
}

/**
 * @param {string} token
 * @returns {Promise<null | User>}
 */
export async function getUserByToken(token) {
  const {
    rows: [session],
  } = await pgClient.query(`select * from tokens where token = $1;`, [token]);

  if (!session) {
    return null;
  }

  const {
    rows: [user],
  } = await pgClient.query(`select * from users where id = $1;`, [
    session.user_id,
  ]);

  return user;
}
