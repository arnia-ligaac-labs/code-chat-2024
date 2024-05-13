import { Router } from "express";
import { MessageService } from "../services/MessageService";

const router = Router();
const messageService = new MessageService();

router.get("/messages", async (req, res) => {
  const messages = await messageService.getAll();
  res.send(messages);
}); 

router.post("/messages", (req, res) => {
  if (!req.body.message) {
    res.status(400).send("Missing message");
  }
  messageService.save(req.body.message);
  res.status(201).send();
});

export { router };
