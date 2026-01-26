import express from "express"
import { isAuth } from "../middleware/isAuth.js";
import { createOrder } from "../controllers/order.controllers.js";

const router = express.Router()

router.get("/create", isAuth, createOrder)

export default router;