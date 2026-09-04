"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BoardService = void 0;
const client_1 = require("@prisma/client");
const prisma_1 = __importDefault(require("../../lib/prisma"));
const AppError_1 = __importDefault(require("../../utils/AppError"));
const getUserBoardRole = async (userId, boardId) => {
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
    if (board.ownerId === userId) {
        return { board, role: client_1.Role.OWNER };
    }
    if (board.members.length > 0) {
        return { board, role: board.members[0].role };
    }
    return { board, role: null };
};
const createBoard = async (userId, payload) => {
    const result = await prisma_1.default.$transaction(async (tx) => {
        // 1. Create Board
        const board = await tx.board.create({
            data: {
                title: payload.title,
                ownerId: userId,
            },
            include: {
                owner: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    },
                },
            },
        });
        // 2. Create Default Columns
        const defaultColumns = [
            { title: "To Do", position: 0, boardId: board.id },
            { title: "In Progress", position: 1, boardId: board.id },
            { title: "Done", position: 2, boardId: board.id },
        ];
        await tx.column.createMany({
            data: defaultColumns,
        });
        // 3. Log Activity
        await tx.activity.create({
            data: {
                userId,
                boardId: board.id,
                action: "CREATE_BOARD",
                details: `Created board "${board.title}"`,
            },
        });
        // Fetch board with columns
        const boardWithColumns = await tx.board.findUnique({
            where: { id: board.id },
            include: {
                owner: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    },
                },
                columns: {
                    orderBy: { position: "asc" },
                },
            },
        });
        return boardWithColumns;
    });
    return result;
};
const getUserBoards = async (userId) => {
    const boards = await prisma_1.default.board.findMany({
        where: {
            OR: [
                { ownerId: userId },
                { members: { some: { userId } } },
            ],
        },
        orderBy: { createdAt: "desc" },
        include: {
            owner: {
                select: {
                    id: true,
                    name: true,
                    email: true,
                },
            },
            members: {
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
            _count: {
                select: {
                    columns: true,
                },
            },
        },
    });
    return boards;
};
const getSingleBoard = async (userId, boardId) => {
    const { role } = await getUserBoardRole(userId, boardId);
    if (!role) {
        throw new AppError_1.default(403, "You do not have access to this board");
    }
    const detailedBoard = await prisma_1.default.board.findUnique({
        where: { id: boardId },
        include: {
            owner: {
                select: {
                    id: true,
                    name: true,
                    email: true,
                },
            },
            members: {
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
            columns: {
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
            },
        },
    });
    return {
        ...detailedBoard,
        userRole: role,
    };
};
const updateBoard = async (userId, boardId, payload) => {
    const { role } = await getUserBoardRole(userId, boardId);
    if (!role || (role !== client_1.Role.OWNER && role !== client_1.Role.EDITOR)) {
        throw new AppError_1.default(403, "You do not have permission to update this board. Requires OWNER or EDITOR.");
    }
    const updatedBoard = await prisma_1.default.$transaction(async (tx) => {
        const board = await tx.board.update({
            where: { id: boardId },
            data: {
                title: payload.title,
            },
        });
        await tx.activity.create({
            data: {
                userId,
                boardId,
                action: "UPDATE_BOARD",
                details: `Updated board title to "${payload.title}"`,
            },
        });
        return board;
    });
    return updatedBoard;
};
const deleteBoard = async (userId, boardId) => {
    const { role, board } = await getUserBoardRole(userId, boardId);
    if (role !== client_1.Role.OWNER) {
        throw new AppError_1.default(403, "Only the board OWNER can delete this board");
    }
    await prisma_1.default.board.delete({
        where: { id: boardId },
    });
    return board;
};
const shareBoard = async (userId, boardId, payload) => {
    const { role, board } = await getUserBoardRole(userId, boardId);
    if (role !== client_1.Role.OWNER) {
        throw new AppError_1.default(403, "Only the board OWNER can share this board");
    }
    const targetUser = await prisma_1.default.user.findUnique({
        where: { email: payload.email },
    });
    if (!targetUser) {
        throw new AppError_1.default(404, "No registered user found with this email");
    }
    if (targetUser.id === board.ownerId) {
        throw new AppError_1.default(400, "This user is already the OWNER of this board");
    }
    const assignedRole = payload.role || client_1.Role.VIEWER;
    const member = await prisma_1.default.$transaction(async (tx) => {
        const boardMember = await tx.boardMember.upsert({
            where: {
                boardId_userId: {
                    boardId,
                    userId: targetUser.id,
                },
            },
            update: {
                role: assignedRole,
            },
            create: {
                boardId,
                userId: targetUser.id,
                role: assignedRole,
            },
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    },
                },
            },
        });
        await tx.activity.create({
            data: {
                userId,
                boardId,
                action: "SHARE_BOARD",
                details: `Shared board with ${targetUser.name} as ${assignedRole}`,
            },
        });
        return boardMember;
    });
    return member;
};
const updateMemberRole = async (userId, boardId, memberId, payload) => {
    const { role } = await getUserBoardRole(userId, boardId);
    if (role !== client_1.Role.OWNER) {
        throw new AppError_1.default(403, "Only the board OWNER can manage member roles");
    }
    const existingMember = await prisma_1.default.boardMember.findUnique({
        where: { id: memberId },
        include: {
            user: {
                select: {
                    id: true,
                    name: true,
                },
            },
        },
    });
    if (!existingMember || existingMember.boardId !== boardId) {
        throw new AppError_1.default(404, "Board member not found on this board");
    }
    const updatedMember = await prisma_1.default.$transaction(async (tx) => {
        const member = await tx.boardMember.update({
            where: { id: memberId },
            data: { role: payload.role },
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    },
                },
            },
        });
        await tx.activity.create({
            data: {
                userId,
                boardId,
                action: "UPDATE_MEMBER_ROLE",
                details: `Updated ${existingMember.user.name}'s role to ${payload.role}`,
            },
        });
        return member;
    });
    return updatedMember;
};
const removeMember = async (userId, boardId, memberId) => {
    const { role } = await getUserBoardRole(userId, boardId);
    const existingMember = await prisma_1.default.boardMember.findUnique({
        where: { id: memberId },
        include: {
            user: {
                select: {
                    id: true,
                    name: true,
                },
            },
        },
    });
    if (!existingMember || existingMember.boardId !== boardId) {
        throw new AppError_1.default(404, "Board member not found on this board");
    }
    // Either board OWNER can remove members, or a member can leave themselves
    const isOwner = role === client_1.Role.OWNER;
    const isSelf = existingMember.userId === userId;
    if (!isOwner && !isSelf) {
        throw new AppError_1.default(403, "You do not have permission to remove this member");
    }
    await prisma_1.default.$transaction(async (tx) => {
        await tx.boardMember.delete({
            where: { id: memberId },
        });
        await tx.activity.create({
            data: {
                userId,
                boardId,
                action: "REMOVE_MEMBER",
                details: isSelf
                    ? `${existingMember.user.name} left the board`
                    : `Removed ${existingMember.user.name} from the board`,
            },
        });
    });
    return { message: "Member removed successfully" };
};
exports.BoardService = {
    createBoard,
    getUserBoards,
    getSingleBoard,
    updateBoard,
    deleteBoard,
    shareBoard,
    updateMemberRole,
    removeMember,
    getUserBoardRole,
};
//# sourceMappingURL=board.service.js.map