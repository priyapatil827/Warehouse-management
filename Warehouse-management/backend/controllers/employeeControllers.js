import { EmployeeModel } from "../models/employeModels.js";
import bcrypt from "bcrypt";

// ================= ADD EMPLOYEE =================
export const addEmployee = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const existing = await EmployeeModel.findOne({ email });
    if (existing) {
      return res.json({ status: false, message: "Employee already exists ❌" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const employee = new EmployeeModel({
      name,
      email,
      password: hashedPassword, // ✅ hashed
    });

    await employee.save();

    res.json({
      status: true,
      message: "Employee added successfully 🎉",
    });
  } catch (err) {
    res.json({ status: false, message: err.message });
  }
};

// ================= EMPLOYEE LOGIN =================
export const employeeLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    const employee = await EmployeeModel.findOne({ email });
    if (!employee) {
      return res.json({ status: false, message: "Employee not found ❌" });
    }

    const isMatch = await bcrypt.compare(password, employee.password);

    if (!isMatch) {
      return res.json({ status: false, message: "Invalid Password ❌" });
    }

    res.json({
      status: true,
      message: "Login Successful 🎉",
      employee,
    });
  } catch (err) {
    res.json({ status: false, message: err.message });
  }
};

// ================= GET ALL =================
export const getEmployee = async (req, res) => {
  try {
    const employees = await EmployeeModel.find();
    res.json(employees);
  } catch (err) {
    return res.json({ status: false, message: err.message });
  }
};

// ================= UPDATE =================
export const updateEmployee = async (req, res) => {
  try {
    const data = { ...req.body };

    // ✅ Hash password if provided
    if (data.password) {
      const salt = await bcrypt.genSalt(10);
      data.password = await bcrypt.hash(data.password, salt);
    } else {
      delete data.password; // ✅ Prevent overwrite with blank
    }

    await EmployeeModel.findByIdAndUpdate(req.params.id, data, { new: true });

    res.json({
      status: true,
      message: "Employee updated successfully 🎉",
    });
  } catch (err) {
    return res.json({ status: false, message: err.message });
  }
};

// ================= DELETE =================
export const deleteEmployee = async (req, res) => {
  try {
    await EmployeeModel.findByIdAndDelete(req.params.id);

    res.json({
      status: true,
      message: "Employee deleted successfully 🎉",
    });
  } catch (err) {
    return res.json({ status: false, message: err.message });
  }
};

export const assignEmployee = async (req, res) => {
  try {
    const { orderId, employeeId } = req.body;

    await OrderModel.findByIdAndUpdate(orderId, {
      assignedEmployee: employeeId,
    });

    res.json({ status: true });
  } catch (err) {
    res.json({ status: false, message: err.message });
  }
};