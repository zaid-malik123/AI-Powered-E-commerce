import express from "express"
import { isAuth } from "../middleware/isAuth.js";
import { createOrder } from "../controllers/order.controllers.js";

const router = express.Router()

router.post("/cod", isAuth, createOrder)

export default router;