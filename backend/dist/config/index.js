"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
dotenv_1.default.config({
    path: path_1.default.join(process.cwd(), ".env"),
});
const config = {
    env: process.env.NODE_ENV || "development",
    port: Number(process.env.PORT) || 5000,
    databaseUrl: process.env.DATABASE_URL,
    jwt: {
        accessSecret: process.env.JWT_ACCESS_SECRET || "kanban_default_jwt_secret_key_12345",
        accessExpiresIn: process.env.JWT_ACCESS_EXPIRES_IN || "7d",
    },
    SaltRounds: Number(process.env.SALT_ROUNDS) || 12,
    frontendUrl: process.env.FRONTEND_URL || "http://localhost:3000",
};
exports.default = config;
//# sourceMappingURL=index.js.map