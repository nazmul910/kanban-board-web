import { NextFunction, Request, Response } from "express";
import { Role } from "@prisma/client";
import prisma from "../lib/prisma";
import AppError from "../utils/AppError";

export interface IBoardAuthRequest extends Request {
  board?: any;
  userRole?: Role;
}

const getParamString = (val: unknown): string | undefined => {
  if (typeof val === "string") return val;
  if (Array.isArray(val) && val.length > 0 && typeof val[0] === "string") return val[0];
  return undefined;
};

export const authorizeBoardAccess = (...allowedRoles: Role[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.user?.userId;

      if (!userId) {
        throw new AppError(401, "Authentication required");
      }

      let boardId =
        getParamString(req.params.boardId) ||
        getParamString(req.params.id) ||
        (typeof req.body?.boardId === "string" ? req.body.boardId : undefined);

      const columnIdParam = getParamString(req.params.columnId);
      if (!boardId && columnIdParam) {
        const column = await prisma.column.findUnique({
          where: { id: columnIdParam },
          select: { boardId: true },
        });
        if (column) boardId = column.boardId;
      }

      const taskIdParam = getParamString(req.params.taskId);
      if (!boardId && taskIdParam) {
        const task = await prisma.task.findUnique({
          where: { id: taskIdParam },
          include: { column: true },
        });
        if (task && (task as any).column?.boardId) {
          boardId = (task as any).column.boardId;
        }
      }

      if (!boardId) {
        throw new AppError(400, "Board ID could not be identified for authorization");
      }

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

      let userRole: Role | null = null;

      if (board.ownerId === userId) {
        userRole = Role.OWNER;
      } else if (board.members.length > 0) {
        userRole = board.members[0].role;
      }

      if (!userRole) {
        throw new AppError(403, "You do not have access to this board");
      }

      if (allowedRoles.length > 0 && !allowedRoles.includes(userRole)) {
        throw new AppError(
          403,
          `Forbidden! You have role ${userRole}, but this action requires: ${allowedRoles.join(", ")}`
        );
      }

      (req as IBoardAuthRequest).board = board;
      (req as IBoardAuthRequest).userRole = userRole;

      next();
    } catch (error) {
      next(error);
    }
  };
};

export default authorizeBoardAccess;
