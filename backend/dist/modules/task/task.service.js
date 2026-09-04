"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TaskService = void 0;
const client_1 = require("@prisma/client");
const prisma_1 = __importDefault(require("../../lib/prisma"));
const AppError_1 = __importDefault(require("../../utils/AppError"));
const board_service_1 = require("../board/board.service");
const createTask = async (userId, payload) => {
    const column = await prisma_1.default.column.findUnique({
        where: { id: payload.columnId },
        select: { id: true, title: true, boardId: true },
    });
    if (!column) {
        throw new AppError_1.default(404, "Column not found");
    }
    const { role } = await board_service_1.BoardService.getUserBoardRole(userId, column.boardId);
    if (!role || (role !== client_1.Role.OWNER && role !== client_1.Role.EDITOR)) {
        throw new AppError_1.default(403, "You do not have permission to create tasks on this board. Requires OWNER or EDITOR.");
    }
    const user = await prisma_1.default.user.findUnique({
        where: { id: userId },
        select: { id: true, name: true },
    });
    const result = await prisma_1.default.$transaction(async (tx) => {
        let position = payload.position;
        if (position === undefined) {
            const lastTask = await tx.task.findFirst({
                where: { columnId: payload.columnId },
                orderBy: { position: "desc" },
            });
            position = lastTask ? lastTask.position + 1 : 0;
        }
        const task = await tx.task.create({
            data: {
                title: payload.title,
                description: payload.description,
                columnId: payload.columnId,
                position,
                createdById: userId,
            },
            include: {
                createdBy: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    },
                },
                column: {
                    select: {
                        id: true,
                        title: true,
                        boardId: true,
                    },
                },
            },
        });
        await tx.activity.create({
            data: {
                userId,
                boardId: column.boardId,
                taskId: task.id,
                action: "CREATE_TASK",
                details: `${user?.name || "User"} created task "${task.title}"`,
            },
        });
        return task;
    });
    return result;
};
const getSingleTask = async (userId, taskId) => {
    const task = await prisma_1.default.task.findUnique({
        where: { id: taskId },
        include: {
            createdBy: {
                select: {
                    id: true,
                    name: true,
                    email: true,
                },
            },
            column: {
                select: {
                    id: true,
                    title: true,
                    boardId: true,
                },
            },
            activities: {
                orderBy: { createdAt: "desc" },
                include: {
                    user: {
                        select: {
                            id: true,
                            name: true,
                            email: true,
                        },
                    },
                },
            },
        },
    });
    if (!task) {
        throw new AppError_1.default(404, "Task not found");
    }
    const { role } = await board_service_1.BoardService.getUserBoardRole(userId, task.column.boardId);
    if (!role) {
        throw new AppError_1.default(403, "You do not have access to this board");
    }
    return {
        ...task,
        userRole: role,
    };
};
const updateTask = async (userId, taskId, payload) => {
    const existingTask = await prisma_1.default.task.findUnique({
        where: { id: taskId },
        include: {
            column: {
                select: {
                    boardId: true,
                },
            },
        },
    });
    if (!existingTask) {
        throw new AppError_1.default(404, "Task not found");
    }
    const { role } = await board_service_1.BoardService.getUserBoardRole(userId, existingTask.column.boardId);
    if (!role || (role !== client_1.Role.OWNER && role !== client_1.Role.EDITOR)) {
        throw new AppError_1.default(403, "You do not have permission to update tasks on this board. Requires OWNER or EDITOR.");
    }
    const user = await prisma_1.default.user.findUnique({
        where: { id: userId },
        select: { id: true, name: true },
    });
    const updatedTask = await prisma_1.default.$transaction(async (tx) => {
        const task = await tx.task.update({
            where: { id: taskId },
            data: {
                title: payload.title ?? existingTask.title,
                description: payload.description !== undefined
                    ? payload.description
                    : existingTask.description,
            },
            include: {
                createdBy: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    },
                },
                column: {
                    select: {
                        id: true,
                        title: true,
                        boardId: true,
                    },
                },
            },
        });
        await tx.activity.create({
            data: {
                userId,
                boardId: existingTask.column.boardId,
                taskId: task.id,
                action: "UPDATE_TASK",
                details: `${user?.name || "User"} updated task "${task.title}"`,
            },
        });
        return task;
    });
    return updatedTask;
};
const deleteTask = async (userId, taskId) => {
    const existingTask = await prisma_1.default.task.findUnique({
        where: { id: taskId },
        include: {
            column: {
                select: {
                    boardId: true,
                },
            },
        },
    });
    if (!existingTask) {
        throw new AppError_1.default(404, "Task not found");
    }
    const { role } = await board_service_1.BoardService.getUserBoardRole(userId, existingTask.column.boardId);
    if (!role || (role !== client_1.Role.OWNER && role !== client_1.Role.EDITOR)) {
        throw new AppError_1.default(403, "You do not have permission to delete tasks on this board. Requires OWNER or EDITOR.");
    }
    const user = await prisma_1.default.user.findUnique({
        where: { id: userId },
        select: { id: true, name: true },
    });
    await prisma_1.default.$transaction(async (tx) => {
        // 1. Log Activity before deleting task
        await tx.activity.create({
            data: {
                userId,
                boardId: existingTask.column.boardId,
                action: "DELETE_TASK",
                details: `${user?.name || "User"} deleted task "${existingTask.title}"`,
            },
        });
        // 2. Delete the Task
        await tx.task.delete({
            where: { id: taskId },
        });
        // 3. Shift remaining tasks positions down
        await tx.task.updateMany({
            where: {
                columnId: existingTask.columnId,
                position: { gt: existingTask.position },
            },
            data: {
                position: { decrement: 1 },
            },
        });
    });
    return { message: "Task deleted successfully", id: taskId };
};
const moveTask = async (userId, taskId, payload) => {
    const { destinationColumnId, destinationIndex } = payload;
    const task = await prisma_1.default.task.findUnique({
        where: { id: taskId },
        include: {
            column: {
                select: {
                    id: true,
                    title: true,
                    boardId: true,
                },
            },
        },
    });
    if (!task) {
        throw new AppError_1.default(404, "Task not found");
    }
    const sourceColumnId = task.columnId;
    const sourceColumnTitle = task.column.title;
    const boardId = task.column.boardId;
    // Check authorization on board
    const { role } = await board_service_1.BoardService.getUserBoardRole(userId, boardId);
    if (!role || (role !== client_1.Role.OWNER && role !== client_1.Role.EDITOR)) {
        throw new AppError_1.default(403, "You do not have permission to move tasks on this board. Requires OWNER or EDITOR.");
    }
    // Check destination column
    const destColumn = await prisma_1.default.column.findUnique({
        where: { id: destinationColumnId },
        select: {
            id: true,
            title: true,
            boardId: true,
        },
    });
    if (!destColumn) {
        throw new AppError_1.default(404, "Destination column not found");
    }
    if (destColumn.boardId !== boardId) {
        throw new AppError_1.default(400, "Cannot move task to a column on a different board");
    }
    const user = await prisma_1.default.user.findUnique({
        where: { id: userId },
        select: { id: true, name: true },
    });
    const userName = user?.name || "User";
    // Execute in Prisma Transaction
    const movedTask = await prisma_1.default.$transaction(async (tx) => {
        // CASE 1: Moving within the SAME column
        if (sourceColumnId === destinationColumnId) {
            const sourceIndex = task.position;
            if (sourceIndex === destinationIndex) {
                return task;
            }
            if (sourceIndex < destinationIndex) {
                // Shift items between (sourceIndex, destinationIndex] up (decrement by 1)
                await tx.task.updateMany({
                    where: {
                        columnId: sourceColumnId,
                        position: {
                            gt: sourceIndex,
                            lte: destinationIndex,
                        },
                    },
                    data: {
                        position: {
                            decrement: 1,
                        },
                    },
                });
            }
            else {
                // Shift items between [destinationIndex, sourceIndex) down (increment by 1)
                await tx.task.updateMany({
                    where: {
                        columnId: sourceColumnId,
                        position: {
                            gte: destinationIndex,
                            lt: sourceIndex,
                        },
                    },
                    data: {
                        position: {
                            increment: 1,
                        },
                    },
                });
            }
            // Update target task position
            const updated = await tx.task.update({
                where: { id: taskId },
                data: {
                    position: destinationIndex,
                },
                include: {
                    column: true,
                    createdBy: {
                        select: { id: true, name: true, email: true },
                    },
                },
            });
            // Log Activity
            await tx.activity.create({
                data: {
                    userId,
                    boardId,
                    taskId: task.id,
                    action: "MOVE_TASK",
                    details: `${userName} reordered task "${task.title}" within ${sourceColumnTitle}`,
                },
            });
            return updated;
        }
        // CASE 2: Moving to a DIFFERENT column
        // 1. Shift remaining tasks in source column down (decrement by 1)
        await tx.task.updateMany({
            where: {
                columnId: sourceColumnId,
                position: {
                    gt: task.position,
                },
            },
            data: {
                position: {
                    decrement: 1,
                },
            },
        });
        // 2. Shift tasks in destination column up (increment by 1) at and after destinationIndex
        await tx.task.updateMany({
            where: {
                columnId: destinationColumnId,
                position: {
                    gte: destinationIndex,
                },
            },
            data: {
                position: {
                    increment: 1,
                },
            },
        });
        // 3. Move the task to destination column and set position
        const updated = await tx.task.update({
            where: { id: taskId },
            data: {
                columnId: destinationColumnId,
                position: destinationIndex,
            },
            include: {
                column: true,
                createdBy: {
                    select: { id: true, name: true, email: true },
                },
            },
        });
        // 4. Log Activity
        await tx.activity.create({
            data: {
                userId,
                boardId,
                taskId: task.id,
                action: "MOVE_TASK",
                details: `${userName} moved task "${task.title}" from ${sourceColumnTitle} to ${destColumn.title}`,
            },
        });
        return updated;
    });
    return movedTask;
};
exports.TaskService = {
    createTask,
    getSingleTask,
    updateTask,
    deleteTask,
    moveTask,
};
//# sourceMappingURL=task.service.js.map