import "dotenv/config";
import express, { Application } from "express";
import { router as messagesRouter } from "./controllers/MessageController";
import { router as conversationsRouter } from "./controllers/ConversationController";
import cors from "cors";

export interface ICustomRequest extends express.Request {
  userId?: string;
  conversationId?: string;
}

const app: Application = express();

app.use(express.json());
app.use(cors());


app.use((req: any, res, next) => {
  req.userId = "123";
  next();
});

app.use((req: ICustomRequest, res, next) => {
  console.log(`Request: ${req.method} ${req.path}`);
  next();
});

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.use("/api/v1/conversations", conversationsRouter);

app.use(
  "/api/v1/conversation/:conversationId/messages",
  (req: ICustomRequest, res, next) => {
    req.conversationId = req.params.conversationId;
    next();
  },
  messagesRouter
);

app.use((req, res) => {
  console.log(`Request not matched ${req.method} ${req.path}`);
  res.status(404).send("Unknown route");
});
export { app };
