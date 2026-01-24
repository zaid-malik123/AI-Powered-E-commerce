import express from "express";
import { isAuth } from "../middleware/isAuth.js";
import { addCartItem, allCartItem, removeAllCart, removeItem, updateCartItem } from "../controllers/cart.controllers.js";

const router = express.Router();

router.post("/add", isAuth, addCartItem)

router.get("/", isAuth, allCartItem)

router.post("/update", isAuth, updateCartItem)

router.get("/delete", isAuth, removeItem)

router.get("/remove-all-cart", isAuth, removeAllCart)


export default router;