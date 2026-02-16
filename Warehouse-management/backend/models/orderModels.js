import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  orderType: {
    type: String,
    enum: ["CUSTOMER", "SUPPLIER"],
  },
  orderedBy: String,

  products: [
    {
      productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
      },
      quantity: Number,
    },
  ],

  totalAmount: Number,

  status: {
    type: String,
    enum: ["PENDING", "PROCESSING", "SHIPPED", "DELIVERED", "REJECTED"],
    default: "PENDING",
  },

  assignedEmployee: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Employee",   // VERY IMPORTANT
  },
});

export const OrderModel = mongoose.model("Order", orderSchema);