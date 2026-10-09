import express from "express";
import dotenv from "dotenv";
import Server from "./server";
import routes from "./routes";

dotenv.config();

const port: any = process.env.PORT || 3000;

const server: any = new Server(port);

server.app.use(express.json());

server.app.use("/api/v1", routes);

server.start();