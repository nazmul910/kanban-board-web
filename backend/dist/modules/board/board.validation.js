"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BoardValidation = void 0;
const zod_1 = require("zod");
const createBoardValidationSchema = zod_1.z.object({
    title: zod_1.z
        .string({
        error: "Title is required",
    })
        .min(1, "Title cannot be empty")
        .max(100, "Title cannot exceed 100 characters"),
});
const updateBoardValidationSchema = zod_1.z.object({
    title: zod_1.z
        .string({
        error: "Title is required",
    })
        .min(1, "Title cannot be empty")
        .max(100, "Title cannot exceed 100 characters"),
});
const shareBoardValidationSchema = zod_1.z.object({
    email: zod_1.z
        .string({
        error: "Email is required",
    })
        .email("Please provide a valid email address"),
    role: zod_1.z.enum(["OWNER", "EDITOR", "VIEWER"]).optional(),
});
const updateMemberRoleValidationSchema = zod_1.z.object({
    role: zod_1.z.enum(["OWNER", "EDITOR", "VIEWER"], {
        error: "Role must be OWNER, EDITOR, or VIEWER",
    }),
});
exports.BoardValidation = {
    createBoardValidationSchema,
    updateBoardValidationSchema,
    shareBoardValidationSchema,
    updateMemberRoleValidationSchema,
};
//# sourceMappingURL=board.validation.js.map