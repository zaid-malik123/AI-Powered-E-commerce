import express from "express";
import { isAuth } from "../middleware/isAuth.js";
import {
	createOrder,
	getAllOrders,
	getUserOrders,
	updateOrderStatus,
} from "../controllers/order.controllers.js";
import { isAdmin } from "../middleware/isAdmin.js";
import {
	createOrderValidator,
	updateOrderStatusValidator,
} from "../validators/order.validators.js";
import { validate } from "../validators/validate.js";

const router = express.Router()

router.post("/create", isAuth, createOrderValidator, validate, createOrder)

router.get("/", isAuth, getUserOrders);

router.get("/all", isAuth, isAdmin, getAllOrders)

router.post(
	"/update-status/:orderId",
	isAuth,
	isAdmin,
	updateOrderStatusValidator,
	validate,
	updateOrderStatus
)


export default router;