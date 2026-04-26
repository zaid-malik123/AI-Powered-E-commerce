import express from "express";
import { adminDetails, adminLogin } from "../controllers/admin.controllers.js";
import { adminLoginValidator } from "../validators/admin.validators.js";
import { validate } from "../validators/validate.js";
import { isAuth } from "../middleware/isAuth.js";
import { isAdmin } from "../middleware/isAdmin.js";

const router = express.Router();

// POST /api/admin/login
router.post("/login", adminLoginValidator, validate, adminLogin);

router.get("/get-admin", isAuth, isAdmin, adminDetails)

export default router;
