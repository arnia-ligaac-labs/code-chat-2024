import { Router } from "express";
import { ConversationService } from "../services/ConversationService";
import { ICustomRequest } from "../express";

const router = Router();
const conversationService = new ConversationService();

router.get("/", async (req: ICustomRequest, res) => {
  const userId = req.userId;
  if (!userId) {
    return res.status(401).send("Missing user id");
  }

  try {
    const conversations = await conversationService.getConversations(userId);
    res.send(conversations);
  } catch (error) {
    console.error(error);
    res.status(500).send("Failed to get conversations");
  }
});

router.post("/", async (req: ICustomRequest, res) => {
  const userId = req.userId;
  if (!userId) {
    return res.status(401).send("Missing user id");
  }

  try {
    await conversationService.saveConversation(userId);
    res.status(201).send();
  } catch (error) {
    console.error(error);
    res.status(500).send("Failed to create conversation");
  }
});

export { router };
