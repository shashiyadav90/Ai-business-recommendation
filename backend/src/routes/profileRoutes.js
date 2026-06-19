import express from "express";
import User from "../models/User.js";
import { verifyToken } from "../middleware/authMiddleware.js";

const router = express.Router();

/* GET PROFILE */
router.get("/", verifyToken, async (req, res) => {
  try {
    const user = await User.findOne({
      phone: req.user.phone,
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.json({
      success: true,
      user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

/* UPDATE PROFILE */
router.put("/", verifyToken, async (req, res) => {
  try {
    const user = await User.findOneAndUpdate(
      {
        phone: req.user.phone,
      },
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    res.json({
      success: true,
      message: "Profile updated successfully",
      user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

export default router;