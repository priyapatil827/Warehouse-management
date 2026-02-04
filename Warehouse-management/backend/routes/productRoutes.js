import express from "express";
import multer from "multer";
import path from "path";
import {
  createProduct,
  deleteProduct,
  editProduct,
  getAllProducts,
  getProductById
} from "../controllers/productControllers.js";

const productRouter = express.Router();

// --- Multer Setup directly in routes ---
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/"); // folder to save images
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = ["image/jpeg", "image/png", "image/jpg" , "image/webp"];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Only JPEG, PNG, JPG are allowed"));
  }
};

const upload = multer({ storage, fileFilter });

// --- Routes ---
productRouter.post("/createProduct", upload.single("image"), createProduct);
productRouter.put("/editProduct/:id", upload.single("image"), editProduct);
productRouter.delete("/deleteProduct/:id", deleteProduct);
productRouter.get("/getAllProducts", getAllProducts);
productRouter.get("/getProductById/:id", getProductById);

export default productRouter;
