import express from "express"
import cookieParser from "cookie-parser"
import cors from "cors"

//Routes
import UserRoutes from "./routes/user.routes.js"
import ProductRoutes from "./routes/product.routes.js"
import AIRoutes from "./routes/ai.routes.js"
import CartRoutes from "./routes/cart.routes.js"
import OrderRoutes from "./routes/order.routes.js"

const app = express()

app.use(cors({
  origin: ["http://localhost:5173"],
  credentials: true, 
}));
app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(cookieParser())

app.get("/" , (req, res) => {
  res.send("HIII 😅")
})

app.use("/api/user", UserRoutes)
app.use("/api/product", ProductRoutes)
app.use("/api/ai", AIRoutes)
app.use("/api/cart", CartRoutes)
app.use("/api/order", OrderRoutes)


export default app;