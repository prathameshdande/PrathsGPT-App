import express from "express";
import { authMiddleware } from "../middlewares/auth.js";
import {
  createChat,
  deleteChat,
  getUserChats,
} from "../controllers/chatController.js";

const chatRouter = express.Router();

chatRouter.get("/create", authMiddleware, createChat);
chatRouter.get("/get", authMiddleware, getUserChats);
chatRouter.post("/delete", authMiddleware, deleteChat);

export default chatRouter;