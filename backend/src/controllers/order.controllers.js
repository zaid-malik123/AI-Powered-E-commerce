import logger from "../config/winston.js";
import Order from "../models/order.model.js";
import Product from "../models/product.model.js";
import User from "../models/user.model.js";
import { sendOrderConfirmationMail } from "../services/mail.service.js";

export const createOrder = async (req, res) => {
  try {
    const userId = req.user._id;

    const user = await User.findById(userId)

    const { items, address, paymentMethod, totalAmount } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ message: "Cart is empty" });
    }

    if (!address) {
      return res.status(400).json({ message: "Address is required" });
    }

    const order = await Order.create({
      user: user._id,
      items,
      totalAmount,
      paymentMethod: paymentMethod || "cod",
      paymentStatus: "Pending", // COD ke liye
      orderStatus: "Placed",
      address,
    });



    await Promise.all(
      order.items.map((item) =>
        Product.findByIdAndUpdate(item.product, {
          $inc: { totalSold: item.quantity },
        }),
      ),
    );
    

    await sendOrderConfirmationMail(user.email, order)

    return res.status(201).json({
      success: true,
      message: "Order placed successfully (COD)",
      order,
    });
  } catch (error) {
    logger.error(`Error in create order : ${error.message}`);
    console.error("Create Order Error:", error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong while creating order",
    });
  }
};

export const getUserOrders = async (req, res) => {
  try {
    const userId = req.user._id;

    const limit = parseInt(req.query.limit) || 20;

    const page = parseInt(req.query.page) || 1;
    const skip = (page - 1) * limit;

    const orders = await Order.find({ user: userId })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate("items.product");

    return res.status(200).json({
      success: true,
      orders,
    });
  } catch (error) {
    logger.error(`Error in get user order : ${error.message}`);
    console.error("Get User Orders Error:", error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong while fetching orders",
    });
  }
};

export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find({}).populate("items.product");

    return res.status(200).json({
      success: true,
      orders,
    });
  } catch (error) {
    logger.error(`Error in get all user orders: ${error.message}`);
    console.error("Get User Orders Error:", error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong while fetching orders",
    });
  }
};

export const updateOrderStatus = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;

    const validStatuses = ["Placed", "Shipped", "Delivered"];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: "Invalid order status" });
    }

    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    order.orderStatus = status;
    await order.save();

    const io = req.app.get("io")

    io.to(order.user.toString()).emit("orderStatusUpdate", {
      orderId: order._id,
      status: status
    })

    return res.status(200).json({
      success: true,
      message: "Order status updated successfully",
      order,
    });
    
  } catch (error) {
    logger.error(`Error in update order status : ${error.message}`);
    console.error("Update Order Status Error:", error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong while updating order status",
    });
  }
};
