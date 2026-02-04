import { ProfileModel } from "../models/profileModel.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

// export const addUser = async (req, res) => {
//   const { email, name, phone, address, exp, age, education } = req.body;
//   try {
//     await ProfileModel.create(req.body);
//     return res.json({ status: true, message: "user added successfully" });
//   } catch (err) {
//     return res.json({ status: false, message: err.message });
//   }
// };

export const updateUser = async (req, res) => {
  const { email } = req.body;
  try {
    await ProfileModel.updateOne({ email }, { $set: req.body });
    return res.json({ status: true, message: "user update successfully" });
  } catch (err) {
    return res.json({ status: false, message: err.message });
  }
};

export const getAllUsers = async (req, res) => {
  try {
    const users = await ProfileModel.find();
    return res.json({
      status: true,
      message: "All users fetched successfulyy",
      users,
    });
  } catch (err) {
    return res.json({ status: false, message: err.message });
  }
};

export const getCurrentUser = (req, res) => {
  try {
    const token = req.cookies.authToken;
    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    console.log(decoded._doc);
    return res.json({
      status: true,
      message: "user fetched successfulyy",
      user: decoded._doc,
    });
  } catch (err) {
    return res.json({ status: false, message: err.message });
  }
};
