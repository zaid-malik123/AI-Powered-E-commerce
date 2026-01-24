import express, { Router } from "express"
import { currUser, login, logout, signup } from "../controllers/user.controllers.js";
import { isAuth } from "../middleware/isAuth.js";
const router = express.Router()



router.post("/signup" , signup)

router.post("/login", login)

router.get("/logout", logout)

router.get("/currUser", isAuth, currUser)

export default router;

