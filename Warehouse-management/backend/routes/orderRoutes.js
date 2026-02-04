import express from "express";
import {
  createOrder,
  getAllOrders,
  getOrdersByUser,
  updateOrderStatus,
} from "../controllers/orderControllers.js";

const orderRouter = express.Router();

orderRouter.post("/createOrder", createOrder);
orderRouter.get("/getAllOrders", getAllOrders);
orderRouter.get("/getOrdersByUser/:orderedBy", getOrdersByUser);
orderRouter.post("/updateOrderStatus", updateOrderStatus);

export default orderRouter;
