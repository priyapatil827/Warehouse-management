import mongoose from "mongoose";

const empBillSchema = new mongoose.Schema(
  {
    products: [
      {
        productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
        quantity: { type: Number, required: true, min: 1 },
      },
    ],
    billType: {
      type: String,
      enum: ["Cash", "Card", "UPI"],
      default: "Cash",
    },
    status: {
      type: String,
      enum: ["Pending", "Processing", "Shipped", "Delivered"],
      default: "Pending",
    },
    totalAmount: { type: Number, required: true },
    employeeName: { type: String, required: true },
  },
  { timestamps: true }
);

export const EmpBillModel = mongoose.model("EmpBill", empBillSchema);