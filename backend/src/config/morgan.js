import morgan from "morgan";
import winston from "winston";
import path from "path";
import DailyRotateFile from "winston-daily-rotate-file";
import "dotenv/config"

const logDir = path.resolve("./logs");

let morganMiddleware;

if (process.env.NODE_ENV === "development") {
  morganMiddleware = morgan("dev"); 
} else if(process.env.NODE_ENV === "production") {
  const accessFileTransport = new DailyRotateFile({
    filename: path.join(logDir, "access-%DATE%.log"),
    datePattern: "YYYY-MM-DD",
    level: "info",
    maxFiles: "7d",
    zippedArchive: false,
  });
  

  const httpLogger = winston.createLogger({
    transports: [accessFileTransport],
    format: winston.format.combine(
      winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
      winston.format.printf(({ timestamp, message }) => `${timestamp}: ${message}`)
    ),
  });

  const stream = {
    write: (message) => httpLogger.info(message.trim()),
  };

  morganMiddleware = morgan("combined", { stream });
}

else {
  morganMiddleware = (req, res, next) => next();
}

export default morganMiddleware;