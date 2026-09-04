"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ActivityService = void 0;
const prisma_1 = __importDefault(require("../../lib/prisma"));
const AppError_1 = __importDefault(require("../../utils/AppError"));
const board_service_1 = require("../board/board.service");
const getTaskActivities = async (userId, taskId) => {
    const task = await prisma_1.default.task.findUnique({
        where: { id: taskId },
        include: {
            column: {
                select: {
                    boardId: true,
                },
            },
        },
    });
    if (!task) {
        throw new AppError_1.default(404, "Task not found");
    }
    const { role } = await board_service_1.BoardService.getUserBoardRole(userId, task.column.boardId);
    if (!role) {
        throw new AppError_1.default(403, "You do not have access to this board's activities");
    }
    const activities = await prisma_1.default.activity.findMany({
        where: { taskId },
        orderBy: { createdAt: "desc" },
        include: {
            user: {
                select: {
                    id: true,
                    name: true,
                    email: true,
                },
            },
            task: {
                select: {
                    id: true,
                    title: true,
                },
            },
        },
    });
    return activities;
};
const getBoardActivities = async (userId, boardId, limit = 50) => {
    const { role } = await board_service_1.BoardService.getUserBoardRole(userId, boardId);
    if (!role) {
        throw new AppError_1.default(403, "You do not have access to this board's activities");
    }
    const activities = await prisma_1.default.activity.findMany({
        where: { boardId },
        orderBy: { createdAt: "desc" },
        take: limit,
        include: {
            user: {
                select: {
                    id: true,
                    name: true,
                    email: true,
                },
            },
            task: {
                select: {
                    id: true,
                    title: true,
                },
            },
        },
    });
    return activities;
};
exports.ActivityService = {
    getTaskActivities,
    getBoardActivities,
};
//# sourceMappingURL=activity.service.js.map