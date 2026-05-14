import express from "express";
import cors from "cors";
import "dotenv/config";
import connectDB from "./configs/db.js";
import userRouter from "./routes/userRoutes.js";
import chatRouter from "./routes/chatRoutes.js";
import messageRouter from "./routes/messageRoutes.js";
import creditRouter from "./routes/creditRoutes.js";
import { stripeWebHook } from "./controllers/webHooks.js";

const app = express();

//stripe webhook route
app.post(
  "/api/webhook/stripe",
  express.raw({ type: "application/json" }),
  stripeWebHook,
);

//middleware
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3000;

//Routes
app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.use("/api/user", userRouter);
app.use("/api/chat", chatRouter);
app.use("/api/message", messageRouter);
app.use("/api/credit/", creditRouter);

const startServer = async () => {
  await connectDB();

  app.listen(PORT, () => {
    console.log(`Server running on ${PORT}`);
  });
};

startServer();
