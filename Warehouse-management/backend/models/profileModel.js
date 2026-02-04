import mongoose from "mongoose";

const profileSchema = new mongoose.Schema(
  {
    email: { type: String, unique: true, required: true },
    name: String,
    phone: String,
    address: String,
    education: String,
    age: Number,
    exp: String,
    image: String,
  },
);

export const ProfileModel = mongoose.model("users", profileSchema);
