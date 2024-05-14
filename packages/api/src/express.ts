import "dotenv/config";
import express, { Application } from "express";
import { router as messagesRouter } from "./controllers/MessageController";

const app: Application = express();

app.use(express.json());

app.use((req, res, next) => {
  console.log("DOING AUTH STUFF, GO AWAY HACKERMAN!");
  next();
});

app.use((req, res, next) => {
  console.log(`Request: ${req.method} ${req.path}`);
  next();
});

app.get("/", (req, res) => {
  res.send("Hello World3!");
});

app.use("/api/v1", messagesRouter);

app.use((req, res) => {
  console.log(`Request not matched ${req.method} ${req.path}`);
  res.status(404).send("Unknown route");
});
export { app };
