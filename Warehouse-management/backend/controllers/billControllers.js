import { EmpBillModel } from "../models/billModel.js";

// Create or update bill
export const createEmpBill = async (req, res) => {
  try {
    const { products, billType, totalAmount, employeeName } = req.body;

    // Check if there is a pending bill for this employee
    let bill = await EmpBillModel.findOne({ employeeName, status: { $ne: "Delivered" } });

    if (bill) {
      // Append products to existing pending/processing/shipped bill
      products.forEach((p) => {
        const existing = bill.products.find((prod) => prod.productId.toString() === p.productId);
        if (existing) existing.quantity += p.quantity;
        else bill.products.push(p);
      });
      bill.totalAmount += totalAmount;
      bill.billType = billType; // update bill type if changed
    } else {
      // Create new bill
      bill = new EmpBillModel({ products, totalAmount, billType, employeeName });
    }

    await bill.save();
    return res.json({ status: true, message: "Bill saved successfully", bill });
  } catch (err) {
    return res.json({ status: false, message: err.message });
  }
};

// Get all bills for employee
export const getEmpBills = async (req, res) => {
  try {
    const { employeeName } = req.query;
    const bills = await EmpBillModel.find({ employeeName }).populate("products.productId");
    return res.json({ status: true, bills });
  } catch (err) {
    return res.json({ status: false, message: err.message });
  }
};

// Update bill status
export const updateEmpBillStatus = async (req, res) => {
  try {
    const { billId, status } = req.body;
    const bill = await EmpBillModel.findById(billId);
    if (!bill) return res.json({ status: false, message: "Bill not found" });

    bill.status = status;
    await bill.save();
    return res.json({ status: true, message: "Bill status updated", bill });
  } catch (err) {
    return res.json({ status: false, message: err.message });
  }
};