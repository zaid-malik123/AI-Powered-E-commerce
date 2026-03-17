import express from "express"
import cookieParser from "cookie-parser"
import cors from "cors"

//Routes
import UserRoutes from "./routes/user.routes.js"
import ProductRoutes from "./routes/product.routes.js"
import CartRoutes from "./routes/cart.routes.js"
import OrderRoutes from "./routes/order.routes.js"
import AdminRoutes from "./routes/admin.routes.js"
import PaymentRoutes from "./routes/payment.routes.js"
import {globalLimiter, strictLimiter, normalLimiter} from "./middleware/rateLimiter.middleware.js"
// import logger from "./config/winston.js"

const app = express()

app.use(cors({
  origin: ["https://outfit-ta1g.onrender.com", "https://e-commerce-1-67wh.onrender.com", "http://localhost:5174", "http://localhost:5173"],
  credentials: true, 
}));
app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(cookieParser())
app.use(globalLimiter);

app.get("/" , (req, res) => {
  res.send("HIII GYUS 😅")
})

// app.get("/test-logger", (req, res) => {
//   try {
//     throw new Error("This is a test error for logger!");
//   } catch (err) {
//     logger.error(`Test logger caught error: ${err.message}`);
//     res.status(500).send("Check your logs folder!");
//   }
// });

app.use("/api/user", strictLimiter,UserRoutes)
app.use("/api/product", normalLimiter,ProductRoutes)
app.use("/api/cart", normalLimiter,CartRoutes)
app.use("/api/order", normalLimiter,OrderRoutes)
app.use("/api/admin", strictLimiter,AdminRoutes)
app.use("/api/payment", strictLimiter,PaymentRoutes)



export default app;