import express from "express";
import { isAuth } from "../middleware/isAuth.js";
import {  createRazorpayOrder, verifyAndSavePayment } from "../controllers/payment.controllers.js";

const router = express.Router();

router.post("/create-order", isAuth, createRazorpayOrder);
router.post("/verify", isAuth, verifyAndSavePayment);

export default router;