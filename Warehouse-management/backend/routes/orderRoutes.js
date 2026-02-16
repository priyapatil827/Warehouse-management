import express from "express";
import {
  createOrder,
  getAllOrders,
  updateOrderStatus,
  assignEmployee,
} from "../controllers/orderControllers.js";

const orderRouter = express.Router();

orderRouter.post("/createOrder", createOrder);
orderRouter.get("/getAllOrders", getAllOrders);
orderRouter.post("/updateOrderStatus", updateOrderStatus);
orderRouter.post("/assignEmployee", assignEmployee);

export default orderRouter;