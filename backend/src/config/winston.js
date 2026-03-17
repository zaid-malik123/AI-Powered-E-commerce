import winston from "winston";
import path from "path";
import DailyRotateFile from "winston-daily-rotate-file";

const logDir = path.resolve('./logs');

const errorTransport = new DailyRotateFile({
  filename: path.join(logDir, 'error-%DATE%.log'), 
  datePattern: 'YYYY-MM-DD',
  level: 'error', 
  maxFiles: '2d',
  zippedArchive: false, 
});

const logger = winston.createLogger({
  level: process.env.NODE_ENV === 'production' ? 'error' : 'debug',
  format: winston.format.combine(
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    winston.format.printf(({ timestamp, level, message }) => `${timestamp} [${level.toUpperCase()}]: ${message}`)
  ),
  transports: [
    new winston.transports.Console({
      format: winston.format.combine(winston.format.colorize({ all: true }))
    }),
    errorTransport
  ]
});

export default logger;