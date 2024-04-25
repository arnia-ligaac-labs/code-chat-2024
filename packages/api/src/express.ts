import "dotenv/config";
import express, { Application } from "express";

const app: Application = express();

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello World3!");
});

export { app };
