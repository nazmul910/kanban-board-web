"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const routes_1 = __importDefault(require("./routes"));
const globalErrorHandler_1 = __importDefault(require("./middleware/globalErrorHandler"));
const notFound_1 = __importDefault(require("./middleware/notFound"));
const config_1 = __importDefault(require("./config"));
const app = (0, express_1.default)();
app.use((0, cors_1.default)({
    origin: config_1.default.frontendUrl || true,
    credentials: true,
}));
app.use((0, cookie_parser_1.default)());
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.get("/", (req, res) => {
    res.status(200).json({
        success: true,
        message: "Mini Kanban Board Backend API is running",
    });
});
// Mount routes for both /api and /api/v1
app.use("/api", routes_1.default);
app.use("/api/v1", routes_1.default);
// Error handlers
app.use(notFound_1.default);
app.use(globalErrorHandler_1.default);
exports.default = app;
//# sourceMappingURL=app.js.map