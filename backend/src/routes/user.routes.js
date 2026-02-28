import express, { Router } from "express"
import { currUser, login, logout, resetPassword, sendOtp, signup, verifyOtp } from "../controllers/user.controllers.js";
import { isAuth } from "../middleware/isAuth.js";
const router = express.Router()



router.post("/signup" , signup)

router.post("/login", login)

router.get("/logout", logout)

router.get("/currUser", isAuth, currUser)

router.post("/send-otp", sendOtp)

router.post("/verify-otp", verifyOtp)

router.post("/reset", resetPassword)

export default router;

