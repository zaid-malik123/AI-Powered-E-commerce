import { z } from "zod";

export const signupform = z.object({
  name: z
    .string()
    .min(3, "Name must be at least 3 characters"),

  email: z
    .string()
    .email("Enter a valid email"),

  password: z
    .string()
    .min(6, "Password must be at least 6 characters"),
});

export const loginform = z.object({
  email: z
    .string()
    .email("Enter a valid email"),

  password: z
    .string()
    .min(6, "Password must be at least 6 characters"),
});

export const checkoutform = z.object({
  firstName: z
    .string()
    .min(2, "First name must be at least 2 characters")
    .max(50, "First name must not exceed 50 characters"),

  lastName: z
    .string()
    .min(2, "Last name must be at least 2 characters")
    .max(50, "Last name must not exceed 50 characters"),

  email: z
    .string()
    .email("Enter a valid email address"),

  street: z
    .string()
    .min(5, "Street address must be at least 5 characters")
    .max(100, "Street address must not exceed 100 characters"),

  city: z
    .string()
    .min(2, "City must be at least 2 characters")
    .max(50, "City must not exceed 50 characters"),

  state: z
    .string()
    .min(2, "State must be at least 2 characters")
    .max(50, "State must not exceed 50 characters"),

  zipcode: z
    .string()
    .regex(/^\d{5,10}$/, "Zipcode must be 5-10 digits"),

  country: z
    .string()
    .min(2, "Country must be at least 2 characters")
    .max(50, "Country must not exceed 50 characters"),

  phone: z
    .string()
    .regex(/^\d{10,15}$/, "Phone must be 10-15 digits"),
});
