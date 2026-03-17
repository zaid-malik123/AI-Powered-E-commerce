import rateLimit from "express-rate-limit";

export const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 250,
});

export const strictLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 50,
  message: "Too many attempts, try later",
});


export const normalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 150,
});