import mongoose from "mongoose";

const chatHistorySchema =
  new mongoose.Schema(
    {
      phone: {
        type: String,
      },

      userMessage: {
        type: String,
        required: true,
      },

      aiResponse: {
        type: Object,
        required: true,
      },
    },
    {
      timestamps: true,
    }
  );

const ChatHistory = mongoose.model(
  "ChatHistory",
  chatHistorySchema
);

export default ChatHistory;