import { Server } from "socket.io";
import app from "../services/ai-agent.js";
import { HumanMessage } from "@langchain/core/messages";
import cookie from "cookie";
import jwt from "jsonwebtoken";

export const initSocket = (httpServer) => {
  const io = new Server(httpServer, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
    },
  });

  io.use((socket, next) => {
    const cookies = socket.handshake.headers?.cookie;

    const { token } = cookies ? cookie.parse(cookies) : {};

    if (!token) {
      return next(new Error("Token not provided"));
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      socket.user = decoded;
      socket.token = token;

      next();
    } catch (err) {
      next(new Error("Invalid token"));
    }
  });

  io.on("connection", (socket) => {
    console.log("A user connected");

    socket.on("message", async (data) => {

    console.log("Received message:", data) 
     const aiResponse = await app.invoke(
        {
          messages: [new HumanMessage(data)],
          token: socket.token,
        },
        {
          metadata: {
            token: socket.token,
          },
        }
      );
      socket.emit(
        "response",
        aiResponse.messages[aiResponse.messages.length - 1].content,
      );
    });

    socket.on("disconnect", () => {
      console.log("A user disconnected");
    });
  });
};
