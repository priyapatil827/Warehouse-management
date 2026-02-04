import mongoose from "mongoose";

const stockSchema = new mongoose.Schema(
  {
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "product",
    },
    type: {
      type: String,
      enum: ["in", "out"],
    },
    quantity: {
      type: Number,
    },
    handledBy: {
      type: String,
    },
  },
  { timestamps: true },
);

export const StockModel = mongoose.model("stock", stockSchema);
