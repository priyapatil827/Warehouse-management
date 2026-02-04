import nodemailer from "nodemailer";
import { OtpModel } from "../models/otpModels.js";
import dotenv from "dotenv";
dotenv.config();

const transport = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL,
    pass: process.env.PASS,
  },
  tls: {
    rejectUnauthorized: false,
  },
});

export const sendOTP = async (email) => {
  const otp = Math.floor(100000 + Math.random() * 900000); // 6-digit OTP
  const expiry = new Date(Date.now() + 1000 * 60 * 10); // 10 minutes

  try {
    // save OTP in DB
    await OtpModel.create({ email, otp, expiry });

    // send HTML email
    await transport.sendMail({
      from: `Admin Security <${process.env.EMAIL}>`,
      to: email,
      subject: "🔐 Secure Login OTP | Admin Panel",
      html: `
  <div style="background: radial-gradient(circle at top right, #7ab9e8, #132f38); padding: 50px 20px; font-family: 'Segoe UI', system-ui, sans-serif;">
    
    <div style="max-width: 460px; margin: auto; background: #ffffff; border-radius: 20px; padding: 35px; box-shadow: 0 25px 60px rgba(0,0,0,0.35); text-align: center; position: relative; overflow: hidden;">
      
      <!-- TOP STRIP -->
      <div style="position: absolute; top: 0; left: 0; width: 100%; height: 8px; background: linear-gradient(90deg, #1e5d66, #60b1b7, #7ab9e8);"></div>

      <!-- BADGE -->
      <div style="display: inline-block; background: #1e5d66; color: #ffffff; padding: 8px 22px; border-radius: 30px; font-size: 12px; letter-spacing: 1px; margin-top: 10px;">
        🏭 WAREHOUSE SECURITY
      </div>

      <h2 style="margin-top: 22px; color: #0b1f2a; font-size: 26px;">
        Verify Your Login
      </h2>

      <p style="color: #39404f; font-size: 15px; line-height: 1.6;">
        Hello <b>${email}</b>,<br/>
        Your warehouse system login request was received.  
        Please use the OTP below to securely continue:
      </p>

      <!-- OTP BOX -->
      <div style="margin: 28px 0; padding: 20px; background: linear-gradient(135deg, #1e5d66, #7ab9e8); color: #ffffff; font-size: 34px; font-weight: bold; letter-spacing: 8px; border-radius: 14px; box-shadow: 0 10px 30px rgba(30,93,102,0.5);">
        ${otp}
      </div>

      <p style="color: #55a6b1; font-size: 14px;">
        ⏳ This OTP is valid for <b>10 minutes</b>
      </p>

      <hr style="margin: 30px 0; border: none; border-top: 1px solid #c5f1f5;" />

      <p style="font-size: 12px; color: #777;">
        If you did not request this login, please ignore this email or contact your warehouse administrator.
      </p>

      <p style="margin-top: 18px; font-size: 12px; color: #bbb;">
        © 2026 Warehouse Management System
      </p>
    </div>
  </div>
`,
    });

    return true;
  } catch (err) {
    console.error("OTP send error:", err.message);
    return false;
  }
};
