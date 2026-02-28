import express from "express";
import { adminLogin } from "../controllers/admin.controllers.js";
import { adminLoginValidator } from "../validators/admin.validators.js";
import { validate } from "../validators/validate.js";

const router = express.Router();

// POST /api/admin/login
router.post("/login", adminLoginValidator, validate, adminLogin);

export default router;
