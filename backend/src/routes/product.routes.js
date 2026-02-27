import express from "express"
import multer from "multer"
import { isAuth } from "../middleware/isAuth.js";
import { isAdmin } from "../middleware/isAdmin.js";
import { createProductController, getAllProducts, filterProducts, getSingleProduct, getRelatedProducts, searchProducts, deleteProduct, updateProduct } from "../controllers/product.controllers.js";
const upload = multer({storage: multer.memoryStorage()});
const router = express.Router()

router.post("/create", upload.single("image"), isAuth, isAdmin, createProductController )

router.get("/all", getAllProducts)

router.post("/filter", filterProducts)

router.get("/related/:id", isAuth, getRelatedProducts)

router.get("/search", searchProducts);

router.get("/:id", getSingleProduct);

router.delete("/delete/:id", isAuth, isAdmin, deleteProduct);

router.put("/update/:id", isAuth, isAdmin, updateProduct);

export default router