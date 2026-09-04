"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const zod_1 = require("zod");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const AppError_1 = __importDefault(require("../utils/AppError"));
const globalErrorHandler = (error, req, res, next) => {
    let statusCode = 500;
    let message = "Something went wrong";
    let errorDetails = error;
    // Custom AppError
    if (error instanceof AppError_1.default) {
        statusCode = error.statusCode;
        message = error.message;
        errorDetails = {
            message: error.message,
        };
    }
    // Zod Validation Error
    else if (error instanceof zod_1.ZodError) {
        statusCode = 400;
        message = "Validation Error";
        errorDetails = error.issues.map((issue) => ({
            path: issue.path.join("."),
            message: issue.message,
        }));
    }
    // JWT Errors
    else if (error instanceof jsonwebtoken_1.default.TokenExpiredError) {
        statusCode = 401;
        message = "Token has expired! Please login again.";
        errorDetails = {
            name: error.name,
            message: error.message,
            expiredAt: error.expiredAt,
        };
    }
    else if (error instanceof jsonwebtoken_1.default.JsonWebTokenError) {
        statusCode = 401;
        message = "Invalid token! Authorization denied.";
        errorDetails = {
            name: error.name,
            message: error.message,
        };
    }
    // Prisma Validation Error
    else if (error instanceof client_1.Prisma.PrismaClientValidationError) {
        statusCode = 400;
        message = "Invalid database request";
        errorDetails = {
            message: error.message,
        };
    }
    // Prisma Known Request Error
    else if (error instanceof client_1.Prisma.PrismaClientKnownRequestError) {
        if (error.code === "P2002") {
            statusCode = 409;
            message = "Duplicate value already exists";
            errorDetails = {
                code: error.code,
                meta: error.meta,
            };
        }
        else if (error.code === "P2025") {
            statusCode = 404;
            message = "Requested resource was not found";
            errorDetails = {
                code: error.code,
            };
        }
        else {
            statusCode = 400;
            message = "Database operation failed";
            errorDetails = {
                code: error.code,
                meta: error.meta,
            };
        }
    }
    // Generic Error
    else if (error instanceof Error) {
        message = error.message;
        errorDetails = {
            message: error.message,
        };
    }
    res.status(statusCode).json({
        success: false,
        message,
        error: errorDetails,
        stack: process.env.NODE_ENV === "development" ? error.stack : undefined,
    });
};
exports.default = globalErrorHandler;
//# sourceMappingURL=globalErrorHandler.js.map