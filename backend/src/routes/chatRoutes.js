import express from "express";
import { chat } from "../controllers/chatController.js";

const router = express.Router();

router.get("/", (req, res) => {
  res.send("Chat API Working 🚀");
});

router.post("/", chat);

export default router;