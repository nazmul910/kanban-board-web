import { z } from "zod";

const registerValidationSchema = z.object({
  name: z
    .string({
      required_error: "Name is required",
    })
    .min(2, "Name must be at least 2 characters")
    .max(100, "Name cannot exceed 100 characters"),

  email: z
    .string({
      required_error: "Email is required",
    })
    .email("Please provide a valid email address"),

  password: z
    .string({
      required_error: "Password is required",
    })
    .min(6, "Password must be at least 6 characters"),
});

const loginValidationSchema = z.object({
  email: z
    .string({
      required_error: "Email is required",
    })
    .email("Please provide a valid email address"),

  password: z
    .string({
      required_error: "Password is required",
    })
    .min(1, "Password is required"),
});

export const AuthValidation = {
  registerValidationSchema,
  loginValidationSchema,
};