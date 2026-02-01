import express from "express"
import { isAuth } from "../middleware/isAuth.js";
import { createOrder, getUserOrders, updateOrderStatus } from "../controllers/order.controllers.js";
import { isAdmin } from "../middleware/isAdmin.js";

const router = express.Router()

router.post("/create", isAuth, createOrder)

router.get("/user-orders", isAuth, getUserOrders);

router.post("/update-status", isAdmin, isAuth, updateOrderStatus)


export default router;