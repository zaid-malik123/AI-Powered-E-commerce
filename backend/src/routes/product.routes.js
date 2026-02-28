import express from "express";
import multer from "multer";
import { isAuth } from "../middleware/isAuth.js";
import { isAdmin } from "../middleware/isAdmin.js";
import {
	createProductController,
	getAllProducts,
	filterProducts,
	getSingleProduct,
	searchProducts,
	deleteProduct,
	latestCollection,
	getBestSellers,
    adminAllProduct,
} from "../controllers/product.controllers.js";
import { createProductValidator, filterProductsValidator } from "../validators/product.validators.js";
import { validate } from "../validators/validate.js";
const upload = multer({storage: multer.memoryStorage()});
const router = express.Router()

router.post(
	"/create",
	upload.single("image"),
	isAuth,
	isAdmin,
	createProductValidator,
	validate,
	createProductController
);

router.get("/all", getAllProducts)

router.get("/admin/all", adminAllProduct)

router.post("/filter", filterProductsValidator, validate, filterProducts)

router.get("/search", searchProducts);

router.get("/latest", latestCollection)

router.get("/best", getBestSellers)

router.get("/:id", getSingleProduct);

router.delete("/delete/:id", isAuth, isAdmin, deleteProduct);

export default router