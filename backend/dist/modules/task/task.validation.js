"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TaskValidation = void 0;
const zod_1 = require("zod");
const createTaskValidationSchema = zod_1.z.object({
    title: zod_1.z
        .string({
        error: "Title is required",
    })
        .min(1, "Title cannot be empty")
        .max(200, "Title cannot exceed 200 characters"),
    description: zod_1.z.string().optional(),
    columnId: zod_1.z
        .string({
        error: "Column ID is required",
    })
        .min(1, "Column ID is required"),
    position: zod_1.z.number().int().nonnegative().optional(),
});
const updateTaskValidationSchema = zod_1.z.object({
    title: zod_1.z
        .string()
        .min(1, "Title cannot be empty")
        .max(200, "Title cannot exceed 200 characters")
        .optional(),
    description: zod_1.z.string().nullable().optional(),
});
const moveTaskValidationSchema = zod_1.z.object({
    destinationColumnId: zod_1.z
        .string({
        error: "Destination column ID is required",
    })
        .min(1, "Destination column ID is required"),
    destinationIndex: zod_1.z
        .number({
        error: "Destination index is required",
    })
        .int("Index must be an integer")
        .nonnegative("Index must be greater than or equal to 0"),
});
exports.TaskValidation = {
    createTaskValidationSchema,
    updateTaskValidationSchema,
    moveTaskValidationSchema,
};
//# sourceMappingURL=task.validation.js.map