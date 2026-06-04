import jwt from "jsonwebtoken";
import client from "../config/twilio.js";

export const sendOTP = async (req, res) => {
  try {
    const { phone } = req.body;

    const phoneRegex = /^[6-9]\d{9}$/;

    if (!phoneRegex.test(phone)) {
      return res.status(400).json({
        success: false,
        message: "Invalid mobile number",
      });
    }

    await client.verify.v2
      .services(process.env.TWILIO_VERIFY_SERVICE_SID)
      .verifications.create({
        to: `+91${phone}`,
        channel: "sms",
      });

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

    if (verificationCheck.status === "approved") {

      const token = jwt.sign(
        { phone },
        process.env.JWT_SECRET,
        { expiresIn: "7d" }
      );

      return res.status(200).json({
        success: true,
        token,
      });
    }

    return res.status(400).json({
      success: false,
      message: "Invalid OTP",
    });

  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};