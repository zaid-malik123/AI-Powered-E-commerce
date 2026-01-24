import app from "./src/app.js";
import {config} from "dotenv"
import { connectDb } from "./src/db/db.js";
config()

const port = process.env.PORT;
connectDb()

app.listen(port, () => {
    console.log(`server is running on this ${port}`)
})