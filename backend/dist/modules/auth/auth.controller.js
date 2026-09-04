"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const sendResponse_1 = __importDefault(require("../../utils/sendResponse"));
const auth_service_1 = require("./auth.service");
const config_1 = __importDefault(require("../../config"));
const registerUser = (0, catchAsync_1.default)(async (req, res) => {
    const result = await auth_service_1.AuthService.registerUser(req.body);
    (0, sendResponse_1.default)(res, {
        statusCode: 201,
        success: true,
        message: "User registered successfully",
        data: result,
    });
});
const loginUser = (0, catchAsync_1.default)(async (req, res) => {
    const { user, accessToken } = await auth_service_1.AuthService.loginUser(req.body);
    const isProduction = config_1.default.env === "production";
    // Set JWT in HTTP-Only Cookie
    res.cookie("accessToken", accessToken, {
        httpOnly: true,
        secure: isProduction,
        sameSite: isProduction ? "none" : "lax",
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in ms
    });
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "User logged in successfully",
        data: {
            user,
            accessToken,
        },
    });
});
const logoutUser = (0, catchAsync_1.default)(async (req, res) => {
    const isProduction = config_1.default.env === "production";
    // Clear HTTP-Only Cookie
    res.clearCookie("accessToken", {
        httpOnly: true,
        secure: isProduction,
        sameSite: isProduction ? "none" : "lax",
    });
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "User logged out successfully",
    });
});
const getCurrentUser = (0, catchAsync_1.default)(async (req, res) => {
    const userId = req.user.userId;
    const result = await auth_service_1.AuthService.getCurrentUser(userId);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "Current user profile fetched successfully",
        data: result,
    });
});
exports.AuthController = {
    registerUser,
    loginUser,
    logoutUser,
    getCurrentUser,
};
//# sourceMappingURL=auth.controller.js.map