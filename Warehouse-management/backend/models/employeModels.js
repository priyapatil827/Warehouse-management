import mongoose from "mongoose";

const employeeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: String,
  department: String,
  role: String,
  salary: Number,
  joinedAt: { type: Date, default: Date.now },
});

export const EmployeeModel = mongoose.model("employee", employeeSchema);
