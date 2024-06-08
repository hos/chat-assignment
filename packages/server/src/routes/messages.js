import { Router } from "express";
import z from "zod";
import { sanitize } from "../utils/sanitize.js";
import {
  MESSAGE_LIMIT,
  createMessage,
  deleteMessageById,
  getMessagesByRoomId,
} from "../database/message.js";
import { requireUser } from "../middleware/authMiddleware.js";
import { getDefaultRoom } from "../database/room.js";

export const router = Router();

// If user not authorized, return 401
router.use(requireUser);

const CreateMessageSchema = z.object({
  body: z.object({
    content: z.string().min(1).max(1000),
  }),
});

router.post("/", async function loginHandler(req, res) {
  const user = req.user;
  const room = await getDefaultRoom();
  const { body } = CreateMessageSchema.parse(req);
  const { content } = body;

  const message = await createMessage({
    content,
    userId: user.id,
    roomId: room.id,
  });

  res.json(sanitize(message));
});

const GetMessagesSchema = z.object({
  query: z.object({
    beforeMessageId: z.number().optional(),
    afterMessageId: z.number().optional(),
    limit: z
      .number()
      .int()
      .positive()
      .max(MESSAGE_LIMIT)
      .default(MESSAGE_LIMIT),
  }),
});

router.get("/", async function getMessagesHandler(req, res) {
  const room = await getDefaultRoom();
  const { query } = GetMessagesSchema.parse(req);
  const { beforeMessageId, afterMessageId, limit } = query;

  const messages = await getMessagesByRoomId({
    roomId: room.id,
    beforeMessageId,
    afterMessageId,
    limit,
  });

  res.json(sanitize(messages));
});

const DeleteMessageSchema = z.object({
  params: z.object({
    messageId: z.coerce.number(),
  }),
});

router.delete("/:messageId", async function deleteMessageHandler(req, res) {
  const user = req.user;
  const { params } = DeleteMessageSchema.parse(req);
  const { messageId } = params;

  const deletedCount = await deleteMessageById(user.id, messageId);

  if (deletedCount === 0) {
    res.sendStatus(404);
    return;
  }

  res.sendStatus(204);
});
