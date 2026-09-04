"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ColumnService = void 0;
const client_1 = require("@prisma/client");
const prisma_1 = __importDefault(require("../../lib/prisma"));
const AppError_1 = __importDefault(require("../../utils/AppError"));
const board_service_1 = require("../board/board.service");
const createColumn = async (userId, payload) => {
    const { role } = await board_service_1.BoardService.getUserBoardRole(userId, payload.boardId);
    if (!role || (role !== client_1.Role.OWNER && role !== client_1.Role.EDITOR)) {
        throw new AppError_1.default(403, "You do not have permission to add columns to this board. Requires OWNER or EDITOR.");
    }
    const result = await prisma_1.default.$transaction(async (tx) => {
        let position = payload.position;
        if (position === undefined) {
            const lastColumn = await tx.column.findFirst({
                where: { boardId: payload.boardId },
                orderBy: { position: "desc" },
            });
            position = lastColumn ? lastColumn.position + 1 : 0;
        }
        const column = await tx.column.create({
            data: {
                title: payload.title,
                boardId: payload.boardId,
                position,
            },
            include: {
                tasks: true,
            },
        });
        await tx.activity.create({
            data: {
                userId,
                boardId: payload.boardId,
                action: "CREATE_COLUMN",
                details: `Created column "${column.title}"`,
            },
        });
        return column;
    });
    return result;
};
const getColumnsByBoard = async (userId, boardId) => {
    const { role } = await board_service_1.BoardService.getUserBoardRole(userId, boardId);
    if (!role) {
        throw new AppError_1.default(403, "You do not have access to this board");
    }
    const columns = await prisma_1.default.column.findMany({
        where: { boardId },
        orderBy: { position: "asc" },
        include: {
            tasks: {
                orderBy: { position: "asc" },
                include: {
                    createdBy: {
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
    return columns;
};
const updateColumn = async (userId, columnId, payload) => {
    const column = await prisma_1.default.column.findUnique({
        where: { id: columnId },
    });
    if (!column) {
        throw new AppError_1.default(404, "Column not found");
    }
    const { role } = await board_service_1.BoardService.getUserBoardRole(userId, column.boardId);
    if (!role || (role !== client_1.Role.OWNER && role !== client_1.Role.EDITOR)) {
        throw new AppError_1.default(403, "You do not have permission to update this column. Requires OWNER or EDITOR.");
    }
    const updatedColumn = await prisma_1.default.$transaction(async (tx) => {
        const updated = await tx.column.update({
            where: { id: columnId },
            data: {
                title: payload.title ?? column.title,
                position: payload.position ?? column.position,
            },
            include: {
                tasks: {
                    orderBy: { position: "asc" },
                },
            },
        });
        if (payload.title && payload.title !== column.title) {
            await tx.activity.create({
                data: {
                    userId,
                    boardId: column.boardId,
                    action: "UPDATE_COLUMN",
                    details: `Renamed column from "${column.title}" to "${payload.title}"`,
                },
            });
        }
        return updated;
    });
    return updatedColumn;
};
const deleteColumn = async (userId, columnId) => {
    const column = await prisma_1.default.column.findUnique({
        where: { id: columnId },
    });
    if (!column) {
        throw new AppError_1.default(404, "Column not found");
    }
    const { role } = await board_service_1.BoardService.getUserBoardRole(userId, column.boardId);
    if (!role || (role !== client_1.Role.OWNER && role !== client_1.Role.EDITOR)) {
        throw new AppError_1.default(403, "You do not have permission to delete this column. Requires OWNER or EDITOR.");
    }
    await prisma_1.default.$transaction(async (tx) => {
        await tx.column.delete({
            where: { id: columnId },
        });
        await tx.activity.create({
            data: {
                userId,
                boardId: column.boardId,
                action: "DELETE_COLUMN",
                details: `Deleted column "${column.title}"`,
            },
        });
    });
    return { message: "Column deleted successfully", id: columnId };
};
const reorderColumns = async (userId, boardId, payload) => {
    const { role } = await board_service_1.BoardService.getUserBoardRole(userId, boardId);
    if (!role || (role !== client_1.Role.OWNER && role !== client_1.Role.EDITOR)) {
        throw new AppError_1.default(403, "You do not have permission to reorder columns on this board");
    }
    const updatedColumns = await prisma_1.default.$transaction(payload.columns.map((col) => prisma_1.default.column.update({
        where: { id: col.id },
        data: { position: col.position },
    })));
    return updatedColumns;
};
exports.ColumnService = {
    createColumn,
    getColumnsByBoard,
    updateColumn,
    deleteColumn,
    reorderColumns,
};
//# sourceMappingURL=column.service.js.map