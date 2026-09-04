import { Role } from "@prisma/client";
import prisma from "../../lib/prisma";
import AppError from "../../utils/AppError";
import {
  ICreateBoard,
  IShareBoard,
  IUpdateBoard,
  IUpdateMemberRole,
} from "./board.interface";

const getUserBoardRole = async (userId: string, boardId: string) => {
  const board = await prisma.board.findUnique({
    where: { id: boardId },
    include: {
      members: {
        where: { userId },
      },
    },
  });

  if (!board) {
    throw new AppError(404, "Board not found");
  }

  if (board.ownerId === userId) {
    return { board, role: Role.OWNER };
  }

  if (board.members.length > 0) {
    return { board, role: board.members[0].role };
  }

  return { board, role: null };
};

const createBoard = async (userId: string, payload: ICreateBoard) => {
  const result = await prisma.$transaction(async (tx) => {
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

    const defaultColumns = [
      { title: "To Do", position: 0, boardId: board.id },
      { title: "In Progress", position: 1, boardId: board.id },
      { title: "Done", position: 2, boardId: board.id },
    ];

    await tx.column.createMany({
      data: defaultColumns,
    });

    await tx.activity.create({
      data: {
        userId,
        boardId: board.id,
        action: "CREATE_BOARD",
        details: `Created board "${board.title}"`,
      },
    });

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

const getUserBoards = async (userId: string) => {
  const boards = await prisma.board.findMany({
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

const getSingleBoard = async (userId: string, boardId: string) => {
  const { role } = await getUserBoardRole(userId, boardId);

  if (!role) {
    throw new AppError(403, "You do not have access to this board");
  }

  const detailedBoard = await prisma.board.findUnique({
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

const updateBoard = async (
  userId: string,
  boardId: string,
  payload: IUpdateBoard
) => {
  const { role } = await getUserBoardRole(userId, boardId);

  if (!role || (role !== Role.OWNER && role !== Role.EDITOR)) {
    throw new AppError(
      403,
      "You do not have permission to update this board. Requires OWNER or EDITOR."
    );
  }

  const updatedBoard = await prisma.$transaction(async (tx) => {
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

const deleteBoard = async (userId: string, boardId: string) => {
  const { role, board } = await getUserBoardRole(userId, boardId);

  if (role !== Role.OWNER) {
    throw new AppError(403, "Only the board OWNER can delete this board");
  }

  await prisma.board.delete({
    where: { id: boardId },
  });

  return board;
};

const shareBoard = async (
  userId: string,
  boardId: string,
  payload: IShareBoard
) => {
  const { role, board } = await getUserBoardRole(userId, boardId);

  if (role !== Role.OWNER) {
    throw new AppError(403, "Only the board OWNER can share this board");
  }

  const targetUser = await prisma.user.findUnique({
    where: { email: payload.email },
  });

  if (!targetUser) {
    throw new AppError(404, "No registered user found with this email");
  }

  if (targetUser.id === board.ownerId) {
    throw new AppError(400, "This user is already the OWNER of this board");
  }

  const assignedRole = payload.role || Role.VIEWER;

  const member = await prisma.$transaction(async (tx) => {
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

const updateMemberRole = async (
  userId: string,
  boardId: string,
  memberId: string,
  payload: IUpdateMemberRole
) => {
  const { role } = await getUserBoardRole(userId, boardId);

  if (role !== Role.OWNER) {
    throw new AppError(403, "Only the board OWNER can manage member roles");
  }

  const existingMember = await prisma.boardMember.findUnique({
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
    throw new AppError(404, "Board member not found on this board");
  }

  const updatedMember = await prisma.$transaction(async (tx) => {
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

const removeMember = async (
  userId: string,
  boardId: string,
  memberId: string
) => {
  const { role } = await getUserBoardRole(userId, boardId);

  const existingMember = await prisma.boardMember.findUnique({
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
    throw new AppError(404, "Board member not found on this board");
  }

  const isOwner = role === Role.OWNER;
  const isSelf = existingMember.userId === userId;

  if (!isOwner && !isSelf) {
    throw new AppError(403, "You do not have permission to remove this member");
  }

  await prisma.$transaction(async (tx) => {
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

export const BoardService = {
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
