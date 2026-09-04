"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authorizeBoardAccess = void 0;
const client_1 = require("@prisma/client");
const prisma_1 = __importDefault(require("../lib/prisma"));
const AppError_1 = __importDefault(require("../utils/AppError"));
const getParamString = (val) => {
    if (typeof val === "string")
        return val;
    if (Array.isArray(val) && val.length > 0 && typeof val[0] === "string")
        return val[0];
    return undefined;
};
const authorizeBoardAccess = (...allowedRoles) => {
    return async (req, res, next) => {
        try {
            const userId = req.user?.userId;
            if (!userId) {
                throw new AppError_1.default(401, "Authentication required");
            }
            let boardId = getParamString(req.params.boardId) ||
                getParamString(req.params.id) ||
                (typeof req.body?.boardId === "string" ? req.body.boardId : undefined);
            const columnIdParam = getParamString(req.params.columnId);
            if (!boardId && columnIdParam) {
                const column = await prisma_1.default.column.findUnique({
                    where: { id: columnIdParam },
                    select: { boardId: true },
                });
                if (column)
                    boardId = column.boardId;
            }
            const taskIdParam = getParamString(req.params.taskId);
            if (!boardId && taskIdParam) {
                const task = await prisma_1.default.task.findUnique({
                    where: { id: taskIdParam },
                    include: { column: true },
                });
                if (task && task.column?.boardId) {
                    boardId = task.column.boardId;
                }
            }
            if (!boardId) {
                throw new AppError_1.default(400, "Board ID could not be identified for authorization");
            }
            const board = await prisma_1.default.board.findUnique({
                where: { id: boardId },
                include: {
                    members: {
                        where: { userId },
                    },
                },
            });
            if (!board) {
                throw new AppError_1.default(404, "Board not found");
            }
            let userRole = null;
            if (board.ownerId === userId) {
                userRole = client_1.Role.OWNER;
            }
            else if (board.members.length > 0) {
                userRole = board.members[0].role;
            }
            if (!userRole) {
                throw new AppError_1.default(403, "You do not have access to this board");
            }
            if (allowedRoles.length > 0 && !allowedRoles.includes(userRole)) {
                throw new AppError_1.default(403, `Forbidden! You have role ${userRole}, but this action requires: ${allowedRoles.join(", ")}`);
            }
            req.board = board;
            req.userRole = userRole;
            next();
        }
        catch (error) {
            next(error);
        }
    };
};
exports.authorizeBoardAccess = authorizeBoardAccess;
exports.default = exports.authorizeBoardAccess;
//# sourceMappingURL=authorization.js.map