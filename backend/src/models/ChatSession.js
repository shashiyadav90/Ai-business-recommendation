import mongoose from "mongoose";

const chatSessionSchema = new mongoose.Schema(
  {
    phone: {
      type: String,
      required: true,
    },

    messages: [
      {
        role: String,
        content: String,
      },
    ],
  },
  {
    timestamps: true,
  }
);

export default mongoose.model(
  "ChatSession",
  chatSessionSchema
);