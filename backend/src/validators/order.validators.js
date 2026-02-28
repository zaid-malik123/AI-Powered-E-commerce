import { body, param } from "express-validator";

export const createOrderValidator = [
  body("items").isArray({ min: 1 }).withMessage("At least one item required"),
  body("address").notEmpty().withMessage("Address is required"),
  body("paymentMethod").optional().isIn(["cod", "online", "cash"]).withMessage("Invalid payment method"),
];

export const updateOrderStatusValidator = [
  param("orderId").isMongoId().withMessage("Valid orderId required"),
  body("status").isString().withMessage("Status is required"),
];
