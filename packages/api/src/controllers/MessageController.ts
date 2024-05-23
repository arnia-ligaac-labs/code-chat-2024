import { Router } from "express";
import { MessageService } from "../services/MessageService";
import { ICustomRequest } from "../express";

const router = Router();
const messageService = new MessageService();

router.get("/", async (req: ICustomRequest, res) => {
  const userId = req.userId;
  const conversationId = req.conversationId;
  if (!userId) {
    return res.status(401).send("Missing user id");
  }
  if (!conversationId) {
    return res.status(400).send("Missing conversation id");
  }

  try {
    const messages = await messageService.getMessages(userId, conversationId);
    res.send(messages);
  } catch (error) {
    console.error(error);
    res.status(500).send("Failed to get messages");
  }
});

router.post("/", async (req: ICustomRequest, res) => {
  const userId = req.userId;
  const conversationId = req.conversationId;
  if (!userId) {
    return res.status(401).send("Missing user id");
  }

  const message = req.body.message;
  if (!message || !conversationId) {
    return res.status(400).send("Missing message or conversation id");
  }

  try {
    await messageService.saveMessage(userId, conversationId, message);
    res.status(201).send();
  } catch (error) {
    console.error(error);
    res.status(500).send("Failed to save message");
  }
});

export { router };
