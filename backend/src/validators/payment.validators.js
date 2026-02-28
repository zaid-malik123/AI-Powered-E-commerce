import { body } from "express-validator";

export const createPaymentValidator = [
  body("amount").isNumeric().withMessage("Amount must be a number"),
];

export const verifyPaymentValidator = [
  body("razorpay_payment_id").notEmpty().withMessage("Payment id required"),
  body("razorpay_order_id").notEmpty().withMessage("Order id required"),
  body("razorpay_signature").notEmpty().withMessage("Signature required"),
];
