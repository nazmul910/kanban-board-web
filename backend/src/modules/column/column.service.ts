import { Role } from "@prisma/client";
import prisma from "../../lib/prisma";
import AppError from "../../utils/AppError";
import { BoardService } from "../board/board.service";
import {
  ICreateColumn,
  IReorderColumns,
  IUpdateColumn,
} from "./column.interface";

const createColumn = async (userId: string, payload: ICreateColumn) => {
  const { role } = await BoardService.getUserBoardRole(
    userId,
    payload.boardId
  );

  if (!role || (role !== Role.OWNER && role !== Role.EDITOR)) {
    throw new AppError(
      403,
      "You do not have permission to add columns to this board. Requires OWNER or EDITOR."
    );
  }

  const result = await prisma.$transaction(async (tx) => {
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

const getColumnsByBoard = async (userId: string, boardId: string) => {
  const { role } = await BoardService.getUserBoardRole(userId, boardId);

  if (!role) {
    throw new AppError(403, "You do not have access to this board");
  }

  const columns = await prisma.column.findMany({
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

const updateColumn = async (
  userId: string,
  columnId: string,
  payload: IUpdateColumn
) => {
  const column = await prisma.column.findUnique({
    where: { id: columnId },
  });

  if (!column) {
    throw new AppError(404, "Column not found");
  }

  const { role } = await BoardService.getUserBoardRole(
    userId,
    column.boardId
  );

  if (!role || (role !== Role.OWNER && role !== Role.EDITOR)) {
    throw new AppError(
      403,
      "You do not have permission to update this column. Requires OWNER or EDITOR."
    );
  }

  const updatedColumn = await prisma.$transaction(async (tx) => {
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

const deleteColumn = async (userId: string, columnId: string) => {
  const column = await prisma.column.findUnique({
    where: { id: columnId },
  });

  if (!column) {
    throw new AppError(404, "Column not found");
  }

  const { role } = await BoardService.getUserBoardRole(
    userId,
    column.boardId
  );

  if (!role || (role !== Role.OWNER && role !== Role.EDITOR)) {
    throw new AppError(
      403,
      "You do not have permission to delete this column. Requires OWNER or EDITOR."
    );
  }

  await prisma.$transaction(async (tx) => {
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

const reorderColumns = async (
  userId: string,
  boardId: string,
  payload: IReorderColumns
) => {
  const { role } = await BoardService.getUserBoardRole(userId, boardId);

  if (!role || (role !== Role.OWNER && role !== Role.EDITOR)) {
    throw new AppError(
      403,
      "You do not have permission to reorder columns on this board"
    );
  }

  const updatedColumns = await prisma.$transaction(
    payload.columns.map((col) =>
      prisma.column.update({
        where: { id: col.id },
        data: { position: col.position },
      })
    )
  );

  return updatedColumns;
};

export const ColumnService = {
  createColumn,
  getColumnsByBoard,
  updateColumn,
  deleteColumn,
  reorderColumns,
};
