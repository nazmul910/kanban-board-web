"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = __importDefault(require("./app"));
const config_1 = __importDefault(require("./config"));
const port = config_1.default.port;
const server = app_1.default.listen(port, () => {
    console.log(`🚀 Server is running on port ${port}`);
    console.log(`📍 Environment: ${config_1.default.env}`);
    console.log(`🌐 http://localhost:${port}`);
});
process.on("SIGTERM", () => {
    console.log("SIGTERM signal received");
    server.close(() => {
        console.log("Server closed successfully");
        process.exit(0);
    });
});
process.on("SIGINT", () => {
    console.log("SIGINT signal received");
    server.close(() => {
        console.log("Server closed successfully");
        process.exit(0);
    });
});
//# sourceMappingURL=server.js.map