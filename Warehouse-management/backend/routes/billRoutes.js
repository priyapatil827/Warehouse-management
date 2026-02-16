import express from "express";
import { createEmpBill, getEmpBills, updateEmpBillStatus } from "../controllers/billControllers.js";

const router = express.Router();

// Create or update employee bill
router.post("/create", createEmpBill);

// Get all bills for an employee
router.get("/getAll", getEmpBills);

// Update bill status
router.put("/updateStatus", updateEmpBillStatus);

export default router;