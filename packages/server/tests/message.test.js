import { test } from "node:test";
import { equal } from "assert";
import { createUser, migrate, pgClient } from "../src/database/index.js";
import { createMessage, getMessagesByRoomId } from "../src/database/message.js";
import { createRoom } from "../src/database/room.js";

await migrate(true);

const room = await createRoom({ name: "main" });
const user = await createUser("msgUser", "myPassword");

await test("must create message", async () => {
  const message = await createMessage({
    userId: user.id,
    roomId: room.id,
    content: "Hello",
  });

  equal(message.user_id, user.id);
});

test("must fail if user don't exists", (context, done) => {
  createMessage({
    userId: 10,
    roomId: room.id,
    content: "Hello",
  }).catch((error) => {
    // violates foreign key constraint
    equal(error.code, "23503");
    done();
  });
});

test("must get messages by room id", async () => {
  // We want to have consistent data for this test,
  // so we will reset the id to start from 1.
  await pgClient.query("truncate messages cascade");
  await pgClient.query("alter sequence messages_id_seq restart with 1");

  for (let i = 0; i < 100; i++) {
    await createMessage({
      userId: user.id,
      roomId: room.id,
      content: `Message ${i}`,
    });
  }

  const fistBatch = await getMessagesByRoomId({ roomId: room.id, limit: 10 });

  equal(fistBatch.length, 10);
  equal(fistBatch.at(0).id, "100");
  equal(fistBatch.at(-1).id, "91");

  const secondBatch = await getMessagesByRoomId({
    roomId: room.id,
    limit: 10,
    beforeMessageId: fistBatch.at(-1).id,
  });

  equal(secondBatch.length, 10);
  equal(secondBatch.at(0).id, 90);
  equal(secondBatch.at(-1).id, 81);

  const middleBatch = await getMessagesByRoomId({
    roomId: room.id,
    limit: 10,
    beforeMessageId: 50,
    afterMessageId: 40,
  });

  equal(middleBatch.length, 9);
  equal(middleBatch.at(0).id, 49);
  equal(middleBatch.at(-1).id, 41);
});
