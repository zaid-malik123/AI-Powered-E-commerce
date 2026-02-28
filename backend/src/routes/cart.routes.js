import express from "express";
import { isAuth } from "../middleware/isAuth.js";
import {
  addCartItem,
  allCartItem,
  removeAllCart,
  removeItem,
  updateCartItem,
} from "../controllers/cart.controllers.js";
import {
  addCartValidator,
  updateCartValidator,
  removeCartValidator,
} from "../validators/cart.validators.js";
import { validate } from "../validators/validate.js";

const router = express.Router();

router.post("/add", isAuth, addCartValidator, validate, addCartItem);

router.get("/", isAuth, allCartItem);

router.put("/update", isAuth, updateCartValidator, validate, updateCartItem);

router.delete("/remove", isAuth, removeCartValidator, validate, removeItem);

router.delete("/remove-all-cart", isAuth, removeAllCart);

export default router;
