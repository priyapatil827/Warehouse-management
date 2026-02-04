import express from "express";
import { addEmployee, deleteEmployee, getEmployee, updateEmployee } from "../controllers/employeeControllers.js";

const employeeRouter = express.Router();

employeeRouter.post("/add-employee", addEmployee);
employeeRouter.get("/get-employee", getEmployee);
employeeRouter.put("/update-employee/:id", updateEmployee);
employeeRouter.delete("/delete-employee/:id", deleteEmployee);

export default employeeRouter;
