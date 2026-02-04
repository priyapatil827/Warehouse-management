import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    orderType: {
      type: String,
      enum: ["customer", "supplier"],
    },
    product: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "product",
        },
        quantity: Number,
        price: Number,
      },
    ],

    totalAmount: Number,
    orderedBy: String,

    status: {
      type: String,
      enum: ["pending", "shipped", "delivered", "cancelled"],   
      default: "pending",
    },
  },
  { timestamps: true },
);

export const OrderModel = mongoose.model("order", orderSchema);
