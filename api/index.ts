import express from "express";
import app from "../src/server/app.js";

const server = express();

server.use(app);

export default server;
