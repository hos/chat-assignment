import { COOKIE_EXPIRY } from "@chat/config";
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
 * @typedef {Object} UserSession
 * @property {User} user
 * @property {Session} session
 * 
 * @param {string} username
 * @param {string} password
 * @returns {Promise<null | UserSession>}
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

  return { user, session };
}

/**
 * @param {string} token
 * @returns {Promise<null | User>}
 */
export async function getUserByToken(token) {
  const {
    rows: [userSession],
  } = await pgClient.query(
    `--sql
    with token as (
      select * from tokens
        where token = $1
        and created_at > now() - ($2 || ' seconds')::interval
    )

    select
      row_to_json(users.*) as user,
      row_to_json(token.*) as session
    from token
    join users on users.id = token.user_id;

  `,
    [token, COOKIE_EXPIRY]
  );

  return userSession;
}
