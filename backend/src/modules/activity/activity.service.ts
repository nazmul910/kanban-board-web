import prisma from "../../lib/prisma";
import AppError from "../../utils/AppError";
import { BoardService } from "../board/board.service";

const getTaskActivities = async (userId: string, taskId: string) => {
  const task = await prisma.task.findUnique({
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
    throw new AppError(404, "Task not found");
  }

  const { role } = await BoardService.getUserBoardRole(
    userId,
    task.column.boardId
  );

  if (!role) {
    throw new AppError(403, "You do not have access to this board's activities");
  }

  const activities = await prisma.activity.findMany({
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

const getBoardActivities = async (
  userId: string,
  boardId: string,
  limit: number = 50
) => {
  const { role } = await BoardService.getUserBoardRole(userId, boardId);

  if (!role) {
    throw new AppError(403, "You do not have access to this board's activities");
  }

  const activities = await prisma.activity.findMany({
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

export const ActivityService = {
  getTaskActivities,
  getBoardActivities,
};
