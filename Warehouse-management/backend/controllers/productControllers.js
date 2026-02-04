import { ProductModel } from "../models/productModels.js";

// Create Product
export const createProduct = async (req, res) => {
  const { name, price, description, category, stock } = req.body;
  const image = req.file ? req.file.filename : null;
  try {
    const newProduct = new ProductModel({
      name,
      price,
      description,
      category,
      stock,
      image,
    });
    await newProduct.save();
    res.json({
      status: true,
      message: "Product created successfully",
      product: newProduct,
    });
  } catch (err) {
    res.json({
      status: false,
      message: "Create product failed",
      error: err.message,
    });
  }
};

// Edit Product
export const editProduct = async (req, res) => {
  const {  name, price, description, category, stock } = req.body;
  const { id } = req.params;
  const image = req.file ? req.file.filename : null;

  try {
    const product = await ProductModel.findById(id);
    if (!product) {
      return res.json({ status: false, message: "Product not found" });
    }
    product.name = name || product.name;
    product.price = price || product.price;
    product.description = description || product.description;
    product.category = category || product.category;
    product.stock = stock || product.stock;
    if (image) product.image = image;
    await product.save();
    res.json({ status: true, message: "Product edited successfully", product });
  } catch (err) {
    res.json({
      status: false,
      message: "Edit product failed",
      error: err.message,
    });
  }
};

// Delete Product
export const deleteProduct = async (req, res) => {
  const { id } = req.params;
  try {
    const product = await ProductModel.findById(id);
    if (!product) {
      return res.json({ status: false, message: "Product not found" });
    }
    await ProductModel.deleteOne({ _id: id });
    res.json({ status: true, message: "Product deleted successfully" });
  } catch (err) {
    res.json({
      status: false,
      message: "Delete product failed",
      error: err.message,
    });
  }
};

// Get All Products
export const getAllProducts = async (req, res) => {
  try {
    const products = await ProductModel.find();
    res.json({ status: true, products });
  } catch (err) {
    res.json({
      status: false,
      message: "Get all products failed",
      error: err.message,
    });
  }
};

// Get Product By ID
export const getProductById = async (req, res) => {
  const { id } = req.params;
  try {
    const product = await ProductModel.findById(id);
    if (!product) {
      return res.json({ status: false, message: "Product not found" });
    }
    res.json({ status: true, product });
  } catch (err) {
    res.json({
      status: false,
      message: "Get product by ID failed",
      error: err.message,
    });
  }
};
