import jwt from "jsonwebtoken";
import client from "../config/twilio.js";
import User from "../models/User.js";

export const sendOTP = async (req, res) => {
  try {
    const { phone } = req.body;

    const verification =
      await client.verify.v2
        .services(process.env.TWILIO_VERIFY_SERVICE_SID)
        .verifications.create({
          to: `+91${phone}`,
          channel: "sms",
        });

    console.log(
      "OTP Sent:",
      verification.sid
    );

    return res.status(200).json({
      success: true,
      message: "OTP sent successfully",
    });

  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const verifyOTP = async (req, res) => {
  try {
    const { phone, otp } = req.body;

    const verificationCheck =
      await client.verify.v2
        .services(process.env.TWILIO_VERIFY_SERVICE_SID)
        .verificationChecks.create({
          to: `+91${phone}`,
          code: otp,
        });

    if (verificationCheck.status !== "approved") {
      return res.status(400).json({
        success: false,
        message: "Invalid OTP",
      });
    }

    let user = await User.findOne({
      phone,
    });

    if (!user) {
      user = await User.create({
        phone,
      });
    }

    const token = jwt.sign(
      {
        phone: user.phone,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );

    return res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      phone: user.phone,
    });

  } catch (error) {

    console.log("================================");
    console.log("VERIFY OTP ERROR");
    console.log(error);
    console.log("Message:", error.message);
    console.log("================================");

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};