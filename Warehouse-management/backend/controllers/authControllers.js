import { AuthModel } from "../models/authModels.js";
import { ProfileModel } from "../models/profileModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { sendOTP } from "../services/otpServices.js";
import { OtpModel } from "../models/otpModels.js";

// Signup
export const signup = async (req, res) => {
  const { email, password } = req.body;
  try {
    // Check if user already exists
    const hashed = await bcrypt.hash(password, 12);
    const user = await ProfileModel.create({ email });
    await AuthModel.create({ email, password: hashed, user: user._id   });

    res.json({ status: true, message: "Signup successful" });
  } catch (err) {
    res.status(500).json({ message: "Signup failed", error: err.message });
  }
};

// Signin
export const signin = async (req, res) => {
  const { email, password } = req.body;
  // Check if user exists
  const user = await AuthModel.findOne({ email });
  if (!user) {
    return res.json({ status: false, message: "User not found" });
  }
  // compare password
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return res.json({ status: false, message: "Incorrect password" });
  }

  const status = await sendOTP(email);

  if (status) {
    res.json({ status: true, message: "Otp send successfully" });
  } else {
    res.json({ status: false, message: "Otp can't sent" });
  }
};

// Verify OTP
export const verifyOtp = async (req, res) => {
  const { email, otp } = req.body;
  const record = await OtpModel.findOne({ email, otp });
  if (!record) {
    return res.json({ status: false, message: "Invalid OTP" });
  }

  if (record.expiry < new Date(Date.now())) {
    return res.json({ status: false, message: "OTP Expired" });
  }
  await OtpModel.deleteMany({ email });
  try {
    const user = await AuthModel.findOne({ email });

    //generate jwt token
    const token = jwt.sign({ ...user }, process.env.SECRET_KEY, {
      expiresIn: "1h",
    });

    res.cookie("authToken", token, { maxAge: 1000 * 60 * 60, httpOnly: true });

    res.json({ status: true, message: "OTP Verify & Signin successful" });
  } catch (err) {
    res.json({ status: false, message: "Signin failed", error: err.message });
  }
};

//change password
export const changePassword = async (req, res) => {
  const { email, oldPassword, newPassword } = req.body;
  try {
    const user = await AuthModel.findOne({ email });
    if (!user) {
      return res.json({ status: false, message: "User not found" });
    }
    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      return res.json({ status: false, message: "Incorrect old password" });
    }
    const hashed = await bcrypt.hash(newPassword, 12);
    await AuthModel.updateOne(
      { email },
      {
        $set: {
          password: hashed,
        },
      },
    );
    res.json({ status: true, message: "Password changed successfully" });
  } catch (err) {
    res.json({
      status: false,
      message: "Change password failed",
      error: err.message,
    });
  }
};

//forgot password
export const forgotPassword = async (req, res) => {
  const { email } = req.body;
  try {
    const user = await AuthModel.findOne({ email });
    const status = await sendOTP(email);
    res.json(status);
  } catch (err) {
    res.json({
      status: false,
      message: "Forgot password failed",
      error: err.message,
    });
  }
};

//change forgot password
export const changeForgotPassword = async (req, res) => {
  const { email, password, otp } = req.body;
  try {
    const record = await OtpModel.findOne({ email, otp });
    if (!record) {
      return res.json({ status: false, message: " OTP is incorrect" });
    }
    if (record.expiry < new Date(Date.now())) {
      return res.json({ status: false, message: " OTP is expired" });
    }
    const hashed = await bcrypt.hash(password, 12);
    await AuthModel.updateOne(
      { email },
      {
        $set: {
          password: hashed,
        },
      },
    );
    res.json({ status: true, message: "Password changed successfully" });
  } catch (err) {
    res.json({
      status: false,
      message: "Change forgot password failed",
      error: err.message,
    });
  }
};

// logout
export const logout = async (req, res) => {
  res.clearCookie("authToken");
  res.json({ message: "Logout successful" });
};

//checkLoginStatus
export const checkLoginStatus = async (req, res) => {
  try {
    const token = req.cookies.authToken;
    if (!token) {
      return res.json({ status: false, message: "Not logged in" });
    }
    const decoded = jwt.verify(token, process.env.SECRET_KEY, {
      expiresIn: "1h",
    });
    res.json({
      status: true,
      message: "Already logged in",
      user: decoded.payload,
    });
  } catch (err) {
    res.json({ status: false, message: "Logged Out, Login first", err });
  }
};
