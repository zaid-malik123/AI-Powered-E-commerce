import Order from "../models/order.model.js";


export const createOrder = async (req, res) => {
  try {
    const userId = req.user._id;
    

    const { items, address, paymentMethod, totalAmount } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ message: "Cart is empty" });
    }

    if (!address) {
      return res.status(400).json({ message: "Address is required" });
    }


    const order = await Order.create({
      user: userId,
      items,
      totalAmount,
      paymentMethod: paymentMethod || "cod",
      paymentStatus: "Pending", // COD ke liye
      orderStatus: "Placed",
      address
    });

    return res.status(201).json({
      success: true,
      message: "Order placed successfully (COD)",
      order
    });

  } catch (error) {
    console.error("Create Order Error:", error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong while creating order"
    });
  }
};