import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: String,
    price: Number,
    description: String,
    category: String,
    stock: Number,
    image:String,
  },
  { timestamps: true },
);

export const ProductModel = mongoose.model("product", productSchema);
