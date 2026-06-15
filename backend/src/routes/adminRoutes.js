import express from "express";
import BusinessMember from "../models/BusinessMember.js";

const router = express.Router();

router.post("/members", async (req, res) => {
  try {
    const member =
      await BusinessMember.create(req.body);

    res.status(201).json(member);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

router.get("/members", async (req, res) => {
  try {
    const members =
      await BusinessMember.find();

    res.json(members);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

router.put("/members/:id", async (req, res) => {
  try {
    const member =
      await BusinessMember.findByIdAndUpdate(
        req.params.id,
        req.body,
        {
          new: true,
        }
      );

    res.json(member);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

router.delete("/members/:id", async (req, res) => {
  try {
    await BusinessMember.findByIdAndDelete(
      req.params.id
    );

    res.json({
      message:
        "Member deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
});

export default router;