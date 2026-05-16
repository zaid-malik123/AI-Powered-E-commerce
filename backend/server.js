import app from "./src/app.js";
import {config} from "dotenv"
import { connectDb } from "./src/db/db.js";
import http from "http"
import { initSocket } from "./src/socket/socket.js";
import {redis} from "./src/config/redis.js"


config()

const port = process.env.PORT;
connectDb()


const server = http.createServer(app);
const io = initSocket(server);
app.set("io", io)

server.listen(port, () => {
    console.log(`server is running on this ${port}`)
})