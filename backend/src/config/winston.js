import winston from "winston";
import path from "path";
import DailyRotateFile from "winston-daily-rotate-file";

const logDir = path.resolve("./logs");

const transports = [];

if (process.env.NODE_ENV === "development") {
  transports.push(new winston.transports.Console({
    format: winston.format.combine(
      winston.format.colorize(),
      winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
      winston.format.printf(({ timestamp, level, message }) => `${timestamp} [${level.toUpperCase()}]: ${message}`)
    )
  }));
} else if (process.env.NODE_ENV === "production") {
  transports.push(new DailyRotateFile({
    filename: path.join(logDir, "error-%DATE%.log"),
    datePattern: "YYYY-MM-DD",
    level: "error",
    maxFiles: "14d", // keep 2 weeks
    zippedArchive: true,
  }));

  transports.push(new DailyRotateFile({
    filename: path.join(logDir, "combined-%DATE%.log"),
    datePattern: "YYYY-MM-DD",
    level: "info",
    maxFiles: "14d",
    zippedArchive: true,
  }));
} else {
  transports.push(new winston.transports.Console({
    silent: true, // no logs in Jest tests
  }));
}

const logger = winston.createLogger({
  level: process.env.NODE_ENV === "development" ? "debug" : "info",
  transports,
});

export default logger;