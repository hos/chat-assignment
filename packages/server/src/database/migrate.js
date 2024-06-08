import { pgClient } from "./client.js";

/**
 * This function will create the tables for us, later this can be replaced with a migration tool.
 * @param {boolean} drop If provided the tables will be dropped before creating them.
 */
export async function migrate(drop) {
  if (drop) {
    await pgClient.exec(`--sql
      drop table if exists tokens;
      drop table if exists users;
    `);
  }

  await pgClient.exec(`--sql
    create table if not exists users (
      id bigint primary key generated always as identity,
      username text not null unique,
      password_hash text not null,
      created_at timestamp default now()
    );

    create table if not exists tokens (
      id bigint primary key generated always as identity,
      user_id bigint references users(id),
      token text not null,
      created_at timestamp default now()
    );
  `);
}
