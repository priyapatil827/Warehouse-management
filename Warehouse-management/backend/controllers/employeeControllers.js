import { EmployeeModel } from "../models/employeModels.js";

export const addEmployee = async (req, res) => {
  try {
    const employee = new EmployeeModel(req.body);
    await employee.save();
    res.json({ status: true, message: "Employee added successfully" });
  } catch (err) {
    return res.json({ status: false, message: err.message });
  }
};

export const getEmployee = async (req, res) => {
  try {
    const employees = await EmployeeModel.find();
    res.json(employees);
  } catch (err) {
    return res.json({ status: false, message: err.message });
  }
};

export const updateEmployee = async (req, res) => {
  try {
    const employee = await EmployeeModel.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true },
    );
    res.json({ status: true, message: "Employee updated successfully" });
  } catch (err) {
    return res.json({ status: false, message: err.message });
  }
};

export const deleteEmployee = async (req, res) => {
  try {
    await EmployeeModel.findByIdAndDelete(req.params.id);
    res.json({ status: true, message: "Employee deleted successfully" });
  } catch (err) {
    return res.json({ status: false, message: err.message });
  }
};
