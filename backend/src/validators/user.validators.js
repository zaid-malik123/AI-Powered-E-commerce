import { body } from "express-validator";

export const signupValidator = [
  body("name").isString().isLength({ min: 2 }).withMessage("Name required"),
  body("email").isEmail().withMessage("Valid email required"),
  body("password").isLength({ min: 6 }).withMessage("Password min 6 chars"),
];

export const loginValidator = [
  body("email").isEmail().withMessage("Valid email required"),
  body("password").exists().withMessage("Password is required"),
];

export const sendOtpValidator = [
  body("email").isEmail().withMessage("Valid email required"),
];

export const verifyOtpValidator = [
  body("email").isEmail().withMessage("Valid email required"),
  body("otp").isLength({ min: 4, max: 6 }).withMessage("OTP must be 4-6 chars"),
];

export const resetValidator = [
  body("email").isEmail().withMessage("Valid email required"),
  body("password").isLength({ min: 6 }).withMessage("Password min 6 chars"),
];
