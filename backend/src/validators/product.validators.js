import { body } from "express-validator";

export const createProductValidator = [
  body("name").notEmpty().withMessage("Name is required"),
  body("description").notEmpty().withMessage("Description is required"),
  body("category").notEmpty().withMessage("Category is required"),
  body("price").isFloat({ gt: 0 }).withMessage("Price must be a positive number"),
  // sizes and subCategory optionally validated via controller
];

export const filterProductsValidator = [
  body("category").optional().isArray().withMessage("Category must be an array"),
  body("subCategory").optional().isArray().withMessage("Subcategory must be an array"),
];
