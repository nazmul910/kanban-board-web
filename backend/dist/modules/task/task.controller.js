"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TaskController = void 0;
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const sendResponse_1 = __importDefault(require("../../utils/sendResponse"));
const task_service_1 = require("./task.service");
const createTask = (0, catchAsync_1.default)(async (req, res) => {
    const userId = req.user.userId;
    const result = await task_service_1.TaskService.createTask(userId, req.body);
    (0, sendResponse_1.default)(res, {
        statusCode: 201,
        success: true,
        message: "Task created successfully",
        data: result,
    });
});
const getSingleTask = (0, catchAsync_1.default)(async (req, res) => {
    const userId = req.user.userId;
    const taskId = (req.params.id || req.params.taskId);
    const result = await task_service_1.TaskService.getSingleTask(userId, taskId);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "Task retrieved successfully",
        data: result,
    });
});
const updateTask = (0, catchAsync_1.default)(async (req, res) => {
    const userId = req.user.userId;
    const taskId = (req.params.id || req.params.taskId);
    const result = await task_service_1.TaskService.updateTask(userId, taskId, req.body);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "Task updated successfully",
        data: result,
    });
});
const deleteTask = (0, catchAsync_1.default)(async (req, res) => {
    const userId = req.user.userId;
    const taskId = (req.params.id || req.params.taskId);
    const result = await task_service_1.TaskService.deleteTask(userId, taskId);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "Task deleted successfully",
        data: result,
    });
});
const moveTask = (0, catchAsync_1.default)(async (req, res) => {
    const userId = req.user.userId;
    const taskId = (req.params.id || req.params.taskId);
    const result = await task_service_1.TaskService.moveTask(userId, taskId, req.body);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "Task moved successfully",
        data: result,
    });
});
exports.TaskController = {
    createTask,
    getSingleTask,
    updateTask,
    deleteTask,
    moveTask,
};
//# sourceMappingURL=task.controller.js.map