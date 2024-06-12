import serverless from "serverless-http";
import { app } from "./express";

module.exports.handler = serverless(app);
