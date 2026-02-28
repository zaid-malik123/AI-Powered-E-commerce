import crypto from "crypto";
import Payment from "../models/payment.model.js";
import Order from "../models/order.model.js";
import Razorpay from "razorpay";
import { sendOrderConfirmationMail, sendPaymentSuccessMail } from "../services/mail.service.js";
import User from "../models/user.model.js";

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

export const createRazorpayOrder = async (req, res) => {
  try {
    const { amount } = req.body;

    if (!amount) {
      return res.status(400).json({ message: "Amount is required" });
    }

    const razorpayOrder = await razorpay.orders.create({
      amount: amount * 100, // rupees → paise
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
    });

    res.status(200).json({
      success: true,
      razorpayOrder,
    });
  } catch (error) {
    console.error("Razorpay Order Error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create Razorpay order",
    });
  }
};

export const verifyAndSavePayment = async (req, res) => {
  try {
    const userId = req.user._id;

    const user = await User.findById(userId)

    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      items,
      address,
      totalAmount,
    } = req.body;

    // 🔐 Verify signature
    const sign = razorpay_order_id + "|" + razorpay_payment_id;

    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(sign)
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({
        success: false,
        message: "Payment verification failed",
      });
    }

    // 🧾 Create ORDER
    const order = await Order.create({
      user: user._id,
      items,
      address,
      totalAmount,
      paymentMethod: "online",
      paymentStatus: "Paid",
      orderStatus: "Placed",
    });

    sendOrderConfirmationMail(user.email, order)

    // 💳 Save PAYMENT
    await Payment.create({
      userId,
      orderId: order._id,
      razorpayOrderId: razorpay_order_id,
      paymentId: razorpay_payment_id,
      signature: razorpay_signature,
      amount: totalAmount,
      paymentMethod: "razorpay",
      status: "completed",
    });

    sendPaymentSuccessMail(user.email, order, razorpay_payment_id)

    res.status(201).json({
      success: true,
      message: "Payment verified & order created",
      order,
    });
  } catch (error) {
    console.error("Payment Verify Error:", error);
    res.status(500).json({
      success: false,
      message: "Payment verification failed",
    });
  }
};