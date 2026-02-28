import { body } from "express-validator";

export const addCartValidator = [
  body("productId").isMongoId().withMessage("Valid productId required"),
  body("quantity").optional().isInt({ gt: 0 }).withMessage("Quantity must be >0"),
];

export const updateCartValidator = [
  body("productId").isMongoId().withMessage("Valid productId required"),
  body("quantity").isInt({ gt: 0 }).withMessage("Quantity must be >0"),
];

export const removeCartValidator = [
  body("productId").isMongoId().withMessage("Valid productId required"),
];
