import mongoose from "mongoose";

const authSchema = new mongoose.Schema(
  {
    email: String,
    password: String,
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "profile",
    },
  },
  { timestamps: true },
);

export const AuthModel = mongoose.model("auth", authSchema);
