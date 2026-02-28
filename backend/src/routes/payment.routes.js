import express from "express";
import { isAuth } from "../middleware/isAuth.js";
import { createRazorpayOrder, verifyAndSavePayment } from "../controllers/payment.controllers.js";
import { createPaymentValidator, verifyPaymentValidator } from "../validators/payment.validators.js";
import { validate } from "../validators/validate.js";

const router = express.Router();

router.post("/create-order", isAuth, createPaymentValidator, validate, createRazorpayOrder);
router.post("/verify", isAuth, verifyPaymentValidator, validate, verifyAndSavePayment);

export default router;