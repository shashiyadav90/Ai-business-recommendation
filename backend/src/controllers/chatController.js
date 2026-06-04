import { getChatResponse } from "../services/groqService.js";

export const chat = async (req, res) => {
  try {
    const { message } = req.body;

    const aiResponse = await getChatResponse(message);

    res.json({
      success: true,
      data: aiResponse
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};