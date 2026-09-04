"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const AppError_1 = __importDefault(require("../utils/AppError"));
const prisma_1 = __importDefault(require("../lib/prisma"));
const config_1 = __importDefault(require("../config"));
const registerUser = async (payload) => {
    const existingUser = await prisma_1.default.user.findUnique({
        where: {
            email: payload.email,
        },
    });
    if (existingUser) {
        throw new AppError_1.default(409, "User already exists with this email");
    }
    const hashedPassword = await bcrypt_1.default.hash(payload.password, config_1.default.SaltRounds);
    const user = await prisma_1.default.user.create({
        data: {
            name: payload.name,
            email: payload.email,
            password: hashedPassword,
        },
        select: {
            id: true,
            name: true,
            email: true,
            createdAt: true,
            updatedAt: true,
        },
    });
    return user;
};
const loginUser = async (payload) => {
    const user = await prisma_1.default.user.findUnique({
        where: {
            email: payload.email,
        },
    });
    if (!user) {
        throw new AppError_1.default(401, "Invalid email or password");
    }
    const isPasswordMatched = await bcrypt_1.default.compare(payload.password, user.password);
    if (!isPasswordMatched) {
        throw new AppError_1.default(401, "Invalid email or password");
    }
    const jwtPayload = {
        userId: user.id,
        email: user.email,
    };
    const accessToken = jsonwebtoken_1.default.sign(jwtPayload, config_1.default.jwt.accessSecret, {
        expiresIn: config_1.default.jwt.accessExpiresIn,
    });
    const userData = {
        id: user.id,
        name: user.name,
        email: user.email,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
    };
    return {
        user: userData,
        accessToken,
    };
};
const getCurrentUser = async (userId) => {
    const user = await prisma_1.default.user.findUnique({
        where: {
            id: userId,
        },
        select: {
            id: true,
            name: true,
            email: true,
            createdAt: true,
            updatedAt: true,
        },
    });
    if (!user) {
        throw new AppError_1.default(404, "User not found");
    }
    return user;
};
exports.AuthService = {
    registerUser,
    loginUser,
    getCurrentUser,
};
//# sourceMappingURL=auth.service.js.map