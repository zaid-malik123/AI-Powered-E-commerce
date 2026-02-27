import express from "express"
import { isAuth } from "../middleware/isAuth.js";
import { createOrder, getAllOrders, getUserOrders, updateOrderStatus } from "../controllers/order.controllers.js";
import { isAdmin } from "../middleware/isAdmin.js";

const router = express.Router()

router.post("/create", isAuth, createOrder)

router.get("/", isAuth, getUserOrders);

router.get("/all", isAuth, isAdmin, getAllOrders)

router.post("/update-status/:orderId",  isAuth,isAdmin, updateOrderStatus)


export default router;