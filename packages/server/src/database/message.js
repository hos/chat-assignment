/**
 * @typedef {Object} Message
 * @property {number} id
 * @property {number} user_id
 * @property {number} room_id
 * @property {string} content
 * @property {string} created_at
 */

import { pgClient } from "./client.js";

export const MESSAGE_LIMIT = 100;

/**
 *
 * @param {Object} message
 * @param {number} message.userId
 * @param {number} message.roomId
 * @param {string} message.content
 * @returns
 */
export async function createMessage({ userId, roomId, content }) {
  const {
    rows: [message],
  } = await pgClient.query(
    `insert into messages (user_id, room_id, content)
      values ($1, $2, $3)
      returning id, user_id, room_id, content, created_at;`,
    [userId, roomId, content]
  );

  return message;
}

/**
 * We prefer here to use cursor based pagination, to avoid having invalid OFFSET,
 * when some rows have been removed.
 * @param {Object} query
 * @param {number} query.roomId
 * @param {number} [query.afterMessageId]
 * @param {number} [query.beforeMessageId]
 * @param {number} [query.limit]
 * @returns {Promise<Message[]>}
 */
export async function getMessagesByRoomId({
  roomId,
  afterMessageId = 0,
  beforeMessageId = Number.MAX_SAFE_INTEGER,
  limit = MESSAGE_LIMIT,
}) {
  const { rows } = await pgClient.query(
    `select * from messages
      where room_id = $1
      and id > $2::bigint
      and (
        case when $3::bigint is null then true else id < $3::bigint end
      )
      order by id desc
      limit $4::int;
    `,
    [roomId, afterMessageId, beforeMessageId, limit]
  );

  return rows;
}

/**
 * Here we need to know which use is deleting the message,
 * to ensure that the user can delete only his own messages.
 * @param {number} userId Who is deleting the message.
 * @param {number} messageId
 * @returns {Promise<number>}
 */
export async function deleteMessageById(userId, messageId) {
  const { affectedRows } = await pgClient.query(
    `delete from messages
      where user_id = $1
      and id = $2;`,
    [userId, messageId]
  );

  return affectedRows;
}
