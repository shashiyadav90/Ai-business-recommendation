import express from "express";
import {
  sendOTP,
  verifyOTP,
  updateUserProfile,
} from "../controllers/authController.js";

import { verifyToken } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/send-otp", sendOTP);

router.post("/verify-otp", verifyOTP);

router.put(
  "/profile",
  verifyToken,
  updateUserProfile
);

export default router;