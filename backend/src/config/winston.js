import winston from "winston";
import path from "path";
import DailyRotateFile from "winston-daily-rotate-file";
import "dotenv/config"

const logDir = path.resolve("./logs");

const transports = [];

// console.log("THIS THE NODE ENV ",process.env.NODE_ENV)
if (process.env.NODE_ENV === "development") {
  // console.log("DEVELOPMENT IS RUNNING")
  transports.push(new winston.transports.Console({
    format: winston.format.combine(
      winston.format.colorize({ all: true }),
      winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
      winston.format.printf(({ timestamp, level, message }) => `${timestamp} [${level.toUpperCase()}]: ${message}`)
    )
  }));
} else {
  // console.log("PRODUCTION IS RUNNING")
  const errorFileTransport = new DailyRotateFile({
    filename: path.join(logDir, "error-%DATE%.log"),
    datePattern: "YYYY-MM-DD",
    level: "error",
    maxFiles: "7d",
    zippedArchive: false,
  });
  transports.push(errorFileTransport);
}

const logger = winston.createLogger({
  level: "error",
  transports,
});

export default logger;