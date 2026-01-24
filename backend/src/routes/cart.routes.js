import express from "express";
import { isAuth } from "../middleware/isAuth.js";
import { addCartItem, allCartItem, removeAllCart, removeItem, updateCartItem } from "../controllers/cart.controllers.js";

const router = express.Router();

router.post("/add", isAuth, addCartItem);

router.get("/", isAuth, allCartItem);

router.put("/update", isAuth, updateCartItem);

router.delete("/remove", isAuth, removeItem);

router.delete("/remove-all-cart", isAuth, removeAllCart);

export default router;