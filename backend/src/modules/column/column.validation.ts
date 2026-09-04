import { z } from "zod";

const createColumnValidationSchema = z.object({
  title: z
    .string({
      error: "Title is required",
    })
    .min(1, "Title cannot be empty")
    .max(100, "Title cannot exceed 100 characters"),
  boardId: z
    .string({
      error: "Board ID is required",
    })
    .min(1, "Board ID is required"),
  position: z.number().int().nonnegative().optional(),
});

const updateColumnValidationSchema = z.object({
  title: z
    .string()
    .min(1, "Title cannot be empty")
    .max(100, "Title cannot exceed 100 characters")
    .optional(),
  position: z.number().int().nonnegative().optional(),
});

const reorderColumnsValidationSchema = z.object({
  columns: z
    .array(
      z.object({
        id: z.string({ error: "Column ID is required" }),
        position: z.number().int().nonnegative({ error: "Position must be a positive integer" }),
      })
    )
    .min(1, "At least one column must be provided"),
});

export const ColumnValidation = {
  createColumnValidationSchema,
  updateColumnValidationSchema,
  reorderColumnsValidationSchema,
};
