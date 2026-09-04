"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthValidation = void 0;
const zod_1 = require("zod");
const registerValidationSchema = zod_1.z.object({
    name: zod_1.z
        .string({
        error: "Name is required",
    })
        .min(2, "Name must be at least 2 characters")
        .max(100, "Name cannot exceed 100 characters"),
    email: zod_1.z
        .string({
        error: "Email is required",
    })
        .email("Please provide a valid email address"),
    password: zod_1.z
        .string({
        error: "Password is required",
    })
        .min(6, "Password must be at least 6 characters"),
});
const loginValidationSchema = zod_1.z.object({
    email: zod_1.z
        .string({
        error: "Email is required",
    })
        .email("Please provide a valid email address"),
    password: zod_1.z
        .string({
        error: "Password is required",
    })
        .min(1, "Password is required"),
});
exports.AuthValidation = {
    registerValidationSchema,
    loginValidationSchema,
};
//# sourceMappingURL=auth.validation.js.map