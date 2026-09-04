"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ColumnValidation = void 0;
const zod_1 = require("zod");
const createColumnValidationSchema = zod_1.z.object({
    title: zod_1.z
        .string({
        error: "Title is required",
    })
        .min(1, "Title cannot be empty")
        .max(100, "Title cannot exceed 100 characters"),
    boardId: zod_1.z
        .string({
        error: "Board ID is required",
    })
        .min(1, "Board ID is required"),
    position: zod_1.z.number().int().nonnegative().optional(),
});
const updateColumnValidationSchema = zod_1.z.object({
    title: zod_1.z
        .string()
        .min(1, "Title cannot be empty")
        .max(100, "Title cannot exceed 100 characters")
        .optional(),
    position: zod_1.z.number().int().nonnegative().optional(),
});
const reorderColumnsValidationSchema = zod_1.z.object({
    columns: zod_1.z
        .array(zod_1.z.object({
        id: zod_1.z.string({ error: "Column ID is required" }),
        position: zod_1.z.number().int().nonnegative({ error: "Position must be a positive integer" }),
    }))
        .min(1, "At least one column must be provided"),
});
exports.ColumnValidation = {
    createColumnValidationSchema,
    updateColumnValidationSchema,
    reorderColumnsValidationSchema,
};
//# sourceMappingURL=column.validation.js.map