import { StockModel } from "../models/stockModels.js";
import { ProductModel } from "../models/productModels.js";

// Stock In
export const stockIn = async (req, res) => {
  const { productId, quantity, handledBy } = req.body;
  try {
    const product = await ProductModel.findById(productId);
    if (!product) {
      return res.json({ status: false, message: "Product not found" });
    }

    const oldStock = product.stock;
    product.stock = oldStock + quantity;
    await product.save();

    const stockInRecord = new StockModel({
      productId,
      type: "in",
      quantity,
      handledBy,
    });
    await stockInRecord.save();

    res.json({
      status: true,
      message: "Stock IN successful",
    });
  } catch (err) {
    res.json({
      status: false,
      message: "Stock IN failed",
      error: err.message,
    });
  }
};

// Stock Out
export const stockOut = async (req, res) => {
  const { productId, quantity, handledBy } = req.body;
  try {
    // Check if product exists
    const product = await ProductModel.findById(productId);
    if (!product) {
      return res.json({ status: false, message: "Product not found" });
    }

    // Check if enough stock is available
    if (product.stock < quantity) {
      return res.json({ status: false, message: "Insufficient stock" });
    }

    const oldStock = product.stock;
    product.stock = oldStock - quantity;
    await product.save();

    const stockOutRecord = new StockModel({
      productId,
      type: "out",
      quantity,
      handledBy,
    });
    await stockOutRecord.save();

    res.json({
      status: true,
      message: "Stock OUT successful",
    });
  } catch (err) {
    res.json({
      status: false,
      message: "Stock OUT failed",
      error: err.message,
    });
  }
};
