import { pgClient } from "./client.js";

export async function createRoom({ name }) {
  // With "on conflict" we can avoid creating a room with the same name,
  // but the returning * want work, so we have to run select again.
  const {
    rows: [room],
  } = await pgClient.query(
    `--sql
    with inserted as (
      insert into rooms (name)
      values ($1)
      on conflict (name) do nothing
      returning *
    )

    select * from inserted
    union all
    select * from rooms where name = $1
    limit 1;`,
    [name]
  );

  return room;
}

let defaultRoom;

export async function getDefaultRoom() {
  if (defaultRoom) {
    return defaultRoom;
  }

  const room = await createRoom({ name: "Main" });

  defaultRoom = room;

  return room;
}
