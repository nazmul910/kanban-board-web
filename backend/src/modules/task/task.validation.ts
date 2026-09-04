import { z } from "zod";

const createTaskValidationSchema = z.object({
  title: z
    .string({
      error: "Title is required",
    })
    .min(1, "Title cannot be empty")
    .max(200, "Title cannot exceed 200 characters"),
  description: z.string().optional(),
  columnId: z
    .string({
      error: "Column ID is required",
    })
    .min(1, "Column ID is required"),
  position: z.number().int().nonnegative().optional(),
});

const updateTaskValidationSchema = z.object({
  title: z
    .string()
    .min(1, "Title cannot be empty")
    .max(200, "Title cannot exceed 200 characters")
    .optional(),
  description: z.string().nullable().optional(),
});

const moveTaskValidationSchema = z.object({
  destinationColumnId: z
    .string({
      error: "Destination column ID is required",
    })
    .min(1, "Destination column ID is required"),
  destinationIndex: z
    .number({
      error: "Destination index is required",
    })
    .int("Index must be an integer")
    .nonnegative("Index must be greater than or equal to 0"),
});

export const TaskValidation = {
  createTaskValidationSchema,
  updateTaskValidationSchema,
  moveTaskValidationSchema,
};
