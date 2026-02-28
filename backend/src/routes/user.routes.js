import express from "express";
import {
	currUser,
	login,
	logout,
	resetPassword,
	sendOtp,
	signup,
	verifyOtp,
} from "../controllers/user.controllers.js";
import { isAuth } from "../middleware/isAuth.js";
import {
	signupValidator,
	loginValidator,
	sendOtpValidator,
	verifyOtpValidator,
	resetValidator,
} from "../validators/user.validators.js";
import { validate } from "../validators/validate.js";
const router = express.Router()



router.post("/signup", signupValidator, validate, signup);

router.post("/login", loginValidator, validate, login);

router.get("/logout", logout)

router.get("/currUser", isAuth, currUser)

router.post("/send-otp", sendOtpValidator, validate, sendOtp);

router.post("/verify-otp", verifyOtpValidator, validate, verifyOtp);

router.post("/reset", resetValidator, validate, resetPassword);

export default router;

