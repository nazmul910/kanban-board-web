"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const AppError_1 = __importDefault(require("../utils/AppError"));
const globalErrorHandler = (error, req, res, next) => {
    let statusCode = 500;
    let message = "Something went wrong";
    let errorDetails = error;
    if (error instanceof AppError_1.default) {
        statusCode = error.statusCode;
        message = error.message;
        errorDetails = {
            message: error.message,
        };
    }
    else if (error instanceof client_1.Prisma.PrismaClientValidationError) {
        statusCode = 400;
        message = "Invalid database request";
        errorDetails = {
            message: error.message,
        };
    }
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