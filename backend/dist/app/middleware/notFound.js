"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const notFound = (req, res) => {
    res.status(404).json({
        success: false,
        message: "API route not found",
        error: {
            path: req.originalUrl,
        },
    });
};
exports.default = notFound;
//# sourceMappingURL=notFound.js.map