import express from "express"
import multer from "multer"
import { isAuth } from "../middleware/isAuth.js";
import { isAdmin } from "../middleware/isAdmin.js";
import { createProductController, getAllProducts, filterProducts, getSingleProduct, getRelatedProducts } from "../controllers/product.controllers.js";
const upload = multer({storage: multer.memoryStorage()});
const router = express.Router()

router.post("/create", upload.single("image"),isAuth, isAdmin, createProductController )

router.get("/all", getAllProducts)

router.post("/filter", filterProducts)

router.get("/:id", isAuth, getSingleProduct)

router.get("/related/:id", isAuth, getRelatedProducts)

export default router