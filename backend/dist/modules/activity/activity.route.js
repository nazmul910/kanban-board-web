"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ActivityRoutes = void 0;
const express_1 = require("express");
const verifyToken_1 = __importDefault(require("../../middleware/verifyToken"));
const activity_controller_1 = require("./activity.controller");
const router = (0, express_1.Router)();
router.get("/task/:taskId", verifyToken_1.default, activity_controller_1.ActivityController.getTaskActivities);
router.get("/board/:boardId", verifyToken_1.default, activity_controller_1.ActivityController.getBoardActivities);
exports.ActivityRoutes = router;
exports.default = router;
//# sourceMappingURL=activity.route.js.map