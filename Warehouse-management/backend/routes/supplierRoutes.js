import express from "express";
import {
  createSupplier,
  getAllSuppliers,
  getSupplierById,
  updateSupplier,
  deleteSupplier,
} from "../controllers/supplierController.js";

const supplierRouter = express.Router();

supplierRouter.post("/add", createSupplier);
supplierRouter.get("/getAll", getAllSuppliers);
supplierRouter.get("/get/:id", getSupplierById);
supplierRouter.put("/update/:id", updateSupplier);
supplierRouter.delete("/delete/:id", deleteSupplier);

export default supplierRouter;
