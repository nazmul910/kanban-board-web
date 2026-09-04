import { z } from "zod";

const createBoardValidationSchema = z.object({
  title: z
    .string({
      error: "Title is required",
    })
    .min(1, "Title cannot be empty")
    .max(100, "Title cannot exceed 100 characters"),
});

const updateBoardValidationSchema = z.object({
  title: z
    .string({
      error: "Title is required",
    })
    .min(1, "Title cannot be empty")
    .max(100, "Title cannot exceed 100 characters"),
});

const shareBoardValidationSchema = z.object({
  email: z
    .string({
      error: "Email is required",
    })
    .email("Please provide a valid email address"),
  role: z.enum(["OWNER", "EDITOR", "VIEWER"] as const).optional(),
});

const updateMemberRoleValidationSchema = z.object({
  role: z.enum(["OWNER", "EDITOR", "VIEWER"] as const, {
    error: "Role must be OWNER, EDITOR, or VIEWER",
  }),
});

export const BoardValidation = {
  createBoardValidationSchema,
  updateBoardValidationSchema,
  shareBoardValidationSchema,
  updateMemberRoleValidationSchema,
};
