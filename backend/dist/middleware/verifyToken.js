"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = __importDefault(require("../config"));
const AppError_1 = __importDefault(require("../utils/AppError"));
const prisma_1 = __importDefault(require("../lib/prisma"));
const verifyToken = async (req, res, next) => {
    try {
        const token = req.cookies?.accessToken ||
            req.cookies?.token ||
            (req.headers.authorization?.startsWith("Bearer ")
                ? req.headers.authorization.split(" ")[1]
                : null);
        if (!token) {
            throw new AppError_1.default(401, "You are not authorized! Please login first.");
        }
        const decoded = jsonwebtoken_1.default.verify(token, config_1.default.jwt.accessSecret);
        const user = await prisma_1.default.user.findUnique({
            where: {
                id: decoded.userId,
            },
        });
        if (!user) {
            throw new AppError_1.default(401, "User no longer exists");
        }
        req.user = {
            userId: user.id,
            email: user.email,
        };
        next();
    }
    catch (error) {
        next(error);
    }
};
exports.default = verifyToken;
//# sourceMappingURL=verifyToken.js.map