import { OrderModel } from "../models/orderModels.js";
import { ProductModel } from "../models/productModels.js";

/*
ORDER BODY:
{
  orderType: "CUSTOMER" | "SUPPLIER",
  products: [
    {
      productId,
      quantity,
      price
    }
  ],
  orderedBy
}
*/

// Create Order
export const createOrder = async (req, res) => {
  try {
    const { orderType, products, orderedBy } = req.body;
    let totalAmount = 0;
    for (const item of products) {
      const product = await ProductModel.findById(item.productId);
      if (!product) {
        return res.json({
          status: false,
          message: `Product with ID ${item.productId} not found`,
        });
      }
      if (orderType === "customer") {
        if (product.stock < item.quantity) {
          return res.json({
            status: false,
            message: `Not enough stock ${product.name}`,
          });
        }
      }

      totalAmount += product.price * item.quantity;
    }

    const newOrder = new OrderModel({
      orderType,
      product: products,
      totalAmount,
      orderedBy,
    });

    for (const item of products) {
      const product = await ProductModel.findById(item.productId);

      if (orderType === "customer") {
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

// Get All Orders
export const getAllOrders = async (req, res) => {
  try {
    const orders = await OrderModel.find()
      .populate("product.productId", "name category price")
      .sort({ createdAt: -1 });

    res.json({ status: true, count: orders.length, orders });
  } catch (err) {
    res.json({
      status: false,
      message: "Get orders failed",
      error: err.message,
    });
  }
};

// Update Order Status
export const updateOrderStatus = async (req, res) => {
  const { orderId, status } = req.body;
  try {
    const order = await OrderModel.findById(orderId);
    if (!order) {
      return res.json({ status: false, message: "Order not found" });
    }

    order.status = status;
    await order.save();

    res.json({
      status: true,
      message: "Order status updated successfully",
      order,
    });
  } catch (err) {
    res.json({
      status: false,
      message: "Update order status failed",
      error: err.message,
    });
  }
};

// Get Orders by user
export const getOrdersByUser = async (req, res) => {
  try {
    const { orderedBy } = req.params;

    const orders = await OrderModel.find({ orderedBy }).populate(
      "products.productId",
      "name category price",
    );

    res.json({
      status: true,
      count: orders.length,
      orders,
    });
  } catch (err) {
    res.json({
      status: false,
      message: "User orders fetch failed",
      error: err.message,
    });
  }
};
