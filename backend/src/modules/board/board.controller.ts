import { Request, Response } from "express";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { BoardService } from "./board.service";

const createBoard = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user!.userId;
  const result = await BoardService.createBoard(userId, req.body);

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "Board created successfully",
    data: result,
  });
});

const getUserBoards = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user!.userId;
  const result = await BoardService.getUserBoards(userId);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Boards retrieved successfully",
    data: result,
  });
});

const getSingleBoard = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user!.userId;
  const boardId = req.params.id as string;
  const result = await BoardService.getSingleBoard(userId, boardId);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Board retrieved successfully",
    data: result,
  });
});

const updateBoard = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user!.userId;
  const boardId = req.params.id as string;
  const result = await BoardService.updateBoard(userId, boardId, req.body);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Board updated successfully",
    data: result,
  });
});

const deleteBoard = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user!.userId;
  const boardId = req.params.id as string;
  const result = await BoardService.deleteBoard(userId, boardId);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Board deleted successfully",
    data: result,
  });
});

const shareBoard = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user!.userId;
  const boardId = req.params.id as string;
  const result = await BoardService.shareBoard(userId, boardId, req.body);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Board shared successfully",
    data: result,
  });
});

const updateMemberRole = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user!.userId;
  const boardId = req.params.id as string;
  const memberId = req.params.memberId as string;
  const result = await BoardService.updateMemberRole(
    userId,
    boardId,
    memberId,
    req.body
  );

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Member role updated successfully",
    data: result,
  });
});

const removeMember = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user!.userId;
  const boardId = req.params.id as string;
  const memberId = req.params.memberId as string;
  const result = await BoardService.removeMember(userId, boardId, memberId);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Member removed successfully",
    data: result,
  });
});

export const BoardController = {
  createBoard,
  getUserBoards,
  getSingleBoard,
  updateBoard,
  deleteBoard,
  shareBoard,
  updateMemberRole,
  removeMember,
};
