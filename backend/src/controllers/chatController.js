import Company from "../models/Company.js";
import ChatHistory from "../models/ChatHistory.js";
import ChatSession from "../models/ChatSession.js";

import {
  getChatResponse,
} from "../services/groqService.js";

export const chat = async (
  req,
  res
) => {
  try {

    const { message } = req.body;

    if (!message?.trim()) {
      return res.status(400).json({
        success: false,
        message: "Message is required",
      });
    }

    const phone =
      req.user?.phone || "Guest";

    let session =
      await ChatSession.findOne({
        phone,
      });

    if (!session) {
      session =
        await ChatSession.create({
          phone,
          messages: [],
        });
    }

    session.messages.push({
      role: "user",
      content: message,
    });

    /*
    |--------------------------------------------------------------------------
    | Remove MongoDB fields before sending to Groq
    |--------------------------------------------------------------------------
    */
    const conversationHistory =
      session.messages.map((msg) => ({
        role: msg.role,
        content: msg.content,
      }));

    const aiResponse =
      await getChatResponse(
        message,
        conversationHistory
      );

    /*
    |--------------------------------------------------------------------------
    | AI asks another question
    |--------------------------------------------------------------------------
    */
    if (
      aiResponse.type ===
      "question"
    ) {

      session.messages.push({
        role: "assistant",
        content:
          aiResponse.question,
      });

      await session.save();

      return res.status(200).json({
        success: true,
        type: "question",
        question:
          aiResponse.question,
      });
    }

    /*
    |--------------------------------------------------------------------------
    | Search Companies
    |--------------------------------------------------------------------------
    */
    const companies =
      await Company.find({
        industry: {
          $regex:
            aiResponse.industry || "",
          $options: "i",
        },

        $or: [
          {
            location: {
              $regex:
                aiResponse
                  .requirements
                  ?.location || "",
              $options: "i",
            },
          },

          {
            services: {
              $elemMatch: {
                $regex:
                  aiResponse
                    .requirements
                    ?.type || "",
                $options: "i",
              },
            },
          },

          {
            description: {
              $regex:
                aiResponse
                  .requirements
                  ?.additionalDetails || "",
              $options: "i",
            },
          },
        ],
      });

    await ChatHistory.create({
      phone,
      userMessage: message,
      aiResponse:
        `${companies.length} companies found`,
    });

    session.messages.push({
      role: "assistant",
      content:
        `${companies.length} companies found`,
    });

    await session.save();

    return res.status(200).json({
      success: true,
      type: "results",
      companies,
      collectedRequirements:
        aiResponse.requirements,
    });

  } catch (error) {

    console.error(
      "Chat Error:",
      error
    );

    return res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};