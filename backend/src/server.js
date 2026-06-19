import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import twilio from "twilio";

import connectDB from "./config/db.js";
import groq from "./config/groq.js";

import authRoutes from "./routes/authRoutes.js";
import chatRoutes from "./routes/chatRoutes.js";

import adminRoutes from "./routes/adminRoutes.js";
import memberRoutes from "./routes/memberRoutes.js";
import profileRoutes from "./routes/profileRoutes.js";

dotenv.config();

/*
|--------------------------------------------------------------------------
| Debug Logs
|--------------------------------------------------------------------------
*/
console.log(
  "TWILIO_ACCOUNT_SID:",
  process.env.TWILIO_ACCOUNT_SID
);

console.log(
  "TWILIO_VERIFY_SERVICE_SID:",
  process.env.TWILIO_VERIFY_SERVICE_SID
);

console.log(
  "MONGODB_URI:",
  process.env.MONGODB_URI
);

console.log(
  "AUTH TOKEN LENGTH:",
  process.env.TWILIO_AUTH_TOKEN?.length
);

console.log(
  "GROQ KEY:",
  process.env.GROQ_API_KEY?.substring(0, 10)
);

/*
|--------------------------------------------------------------------------
| Connect Database
|--------------------------------------------------------------------------
*/
connectDB();

/*
|--------------------------------------------------------------------------
| App Initialization
|--------------------------------------------------------------------------
*/
const app = express();

/*
|--------------------------------------------------------------------------
| Middlewares
|--------------------------------------------------------------------------
*/
app.use(cors());

app.use(
  express.json({
    limit: "10mb",
  })
);

app.use(
  express.urlencoded({
    extended: true,
  })
);

/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
*/
app.use("/api/auth", authRoutes);

app.use("/api/chat", chatRoutes);

app.use("/api/admin", adminRoutes);

app.use("/api/members", memberRoutes);

app.use("/api/profile", profileRoutes);

/*
|--------------------------------------------------------------------------
| Health Check
|--------------------------------------------------------------------------
*/
app.get("/", (req, res) => {
  return res.status(200).json({
    success: true,
    message:
      "Business Recommendation Backend Running 🚀",
  });
});

/*
|--------------------------------------------------------------------------
| Groq Test Route
|--------------------------------------------------------------------------
*/
app.get(
  "/groq-direct-test",
  async (req, res) => {
    try {
      const completion =
        await groq.chat.completions.create({
          model:
            "llama-3.3-70b-versatile",
          messages: [
            {
              role: "user",
              content: "Say Hello",
            },
          ],
        });

      return res.status(200).json({
        success: true,
        response:
          completion.choices[0].message
            .content,
      });

    } catch (error) {

      console.error(
        "GROQ TEST ERROR"
      );

      console.error(error);

      return res.status(500).json({
        success: false,
        message:
          error.message,
        status:
          error.status,
      });

    }
  }
);

/*
|--------------------------------------------------------------------------
| Twilio Test Route
|--------------------------------------------------------------------------
*/
app.get(
  "/twilio-test",
  async (req, res) => {
    try {
      const client = twilio(
        process.env.TWILIO_ACCOUNT_SID,
        process.env.TWILIO_AUTH_TOKEN
      );

      const account =
        await client.api.v2010
          .accounts(
            process.env.TWILIO_ACCOUNT_SID
          )
          .fetch();

      return res.status(200).json({
        success: true,
        sid: account.sid,
        friendlyName:
          account.friendlyName,
        status:
          account.status,
      });

    } catch (error) {

      console.error(
        "TWILIO TEST ERROR"
      );

      console.error(error);

      return res.status(500).json({
        success: false,
        message:
          error.message,
      });

    }
  }
);

/*
|--------------------------------------------------------------------------
| Global Error Handler
|--------------------------------------------------------------------------
*/
app.use(
  (err, req, res, next) => {

    console.error(
      "GLOBAL ERROR:"
    );

    console.error(err);

    return res.status(500).json({
      success: false,
      message:
        err.message ||
        "Internal Server Error",
    });

  }
);

/*
|--------------------------------------------------------------------------
| Start Server
|--------------------------------------------------------------------------
*/
const PORT =
  process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(
    `Server running on port ${PORT}`
  );
});