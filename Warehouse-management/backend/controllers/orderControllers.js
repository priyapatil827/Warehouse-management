import { OrderModel } from "../models/orderModels.js";
import { ProductModel } from "../models/productModels.js";
import { EmployeeModel } from "../models/employeModels.js";


// ================= CREATE ORDER =================
export const createOrder = async (req, res) => {
  try {
    const { orderType, products, orderedBy } = req.body;

    if (!orderType || !products?.length || !orderedBy) {
      return res.json({
        status: false,
        message: "All fields required",
      });
    }

    let totalAmount = 0;
    const updatedProducts = [];

    for (const item of products) {
      const product = await ProductModel.findById(item.productId);

      if (!product) {
        return res.json({
          status: false,
          message: "Product not found",
        });
      }

      if (orderType === "CUSTOMER" && product.stock < item.quantity) {
        return res.json({
          status: false,
          message: `Not enough stock for ${product.name}`,
        });
      }

      totalAmount += product.price * item.quantity;

      updatedProducts.push({
        productId: product._id,
        quantity: item.quantity,
        price: product.price,
      });
    }

    const newOrder = new OrderModel({
      orderType,
      products: updatedProducts,
      totalAmount,
      orderedBy,
    });

    await newOrder.save();

    // 🔥 Update Stock
    for (const item of updatedProducts) {
      const product = await ProductModel.findById(item.productId);

      if (orderType === "CUSTOMER") {
        product.stock -= item.quantity;
      } else {
        product.stock += item.quantity;
      }

      await product.save();
    }

    res.json({
      status: true,
      message: "Order created successfully",
      order: newOrder,
    });
  } catch (err) {
    res.json({
      status: false,
      message: "Create order failed",
      error: err.message,
    });
  }
};


// ================= GET ALL ORDERS =================
export const getAllOrders = async (req, res) => {
  try {
    const orders = await OrderModel.find()
      .populate("products.productId", "name price stock")
      .populate("assignedEmployee", "name email")
      .sort({ createdAt: -1 });

    res.json({
      status: true,
      orders,
    });
  } catch (err) {
    res.json({
      status: false,
      message: "Get orders failed",
      error: err.message,
    });
  }
};


// ================= UPDATE STATUS =================
export const updateOrderStatus = async (req, res) => {
  try {
    const { orderId, status } = req.body;

    const order = await OrderModel.findById(orderId);
    if (!order) {
      return res.json({ status: false, message: "Order not found" });
    }

    order.status = status;
    await order.save();

    res.json({
      status: true,
      message: "Status updated successfully",
      order,
    });
  } catch (err) {
    res.json({
      status: false,
      message: "Update failed",
      error: err.message,
    });
  }
};


// ================= ASSIGN EMPLOYEE =================
export const assignEmployee = async (req, res) => {
  try {
    const { orderId, employeeId } = req.body;

    const order = await OrderModel.findById(orderId);
    if (!order) {
      return res.json({
        status: false,
        message: "Order not found",
      });
    }

    const employee = await EmployeeModel.findById(employeeId);
    if (!employee) {
      return res.json({
        status: false,
        message: "Employee not found",
      });
    }

    order.assignedEmployee = employeeId;
    order.status = "PROCESSING";

    await order.save();

    res.json({
      status: true,
      message: "Employee assigned successfully",
      order,
    });
  } catch (err) {
    res.json({
      status: false,
      message: "Assign failed",
      error: err.message,
    });
  }
};