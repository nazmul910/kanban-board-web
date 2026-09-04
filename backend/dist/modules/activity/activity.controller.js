"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ActivityController = void 0;
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const sendResponse_1 = __importDefault(require("../../utils/sendResponse"));
const activity_service_1 = require("./activity.service");
const getTaskActivities = (0, catchAsync_1.default)(async (req, res) => {
    const userId = req.user.userId;
    const taskId = (req.params.taskId || req.params.id);
    const result = await activity_service_1.ActivityService.getTaskActivities(userId, taskId);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "Task activities retrieved successfully",
        data: result,
    });
});
const getBoardActivities = (0, catchAsync_1.default)(async (req, res) => {
    const userId = req.user.userId;
    const boardId = (req.params.boardId || req.params.id);
    const limit = req.query.limit ? Number(req.query.limit) : 50;
    const result = await activity_service_1.ActivityService.getBoardActivities(userId, boardId, limit);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "Board activities retrieved successfully",
        data: result,
    });
});
exports.ActivityController = {
    getTaskActivities,
    getBoardActivities,
};
//# sourceMappingURL=activity.controller.js.map