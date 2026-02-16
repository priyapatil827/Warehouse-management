import express from "express";
import {
  addEmployee,
  employeeLogin,
  getEmployee,
  updateEmployee,
  deleteEmployee,
  assignEmployee,
} from "../controllers/employeeControllers.js";

const employeeRouter = express.Router();

employeeRouter.post("/add-employee", addEmployee);
employeeRouter.post("/login", employeeLogin);
employeeRouter.get("/get-employee", getEmployee);
employeeRouter.put("/update-employee/:id", updateEmployee);
employeeRouter.delete("/delete-employee/:id", deleteEmployee);
employeeRouter.post("assign-employee",assignEmployee);

export default employeeRouter;