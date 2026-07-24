import express from "express";
import { authMiddleware } from "../middlewares/auth.js";
import {
  imageMessageController,
  textMessageController,
  getPublishedImages,
} from "../controllers/messageController.js";

const messageRouter = express.Router();

// Defining message routes
messageRouter.post("/text", authMiddleware, textMessageController);
messageRouter.post("/image", authMiddleware, imageMessageController);
messageRouter.get("/published", getPublishedImages);

export default messageRouter;