import { Request, Response } from "express";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { ColumnService } from "./column.service";

const createColumn = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user!.userId;
  const result = await ColumnService.createColumn(userId, req.body);

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "Column created successfully",
    data: result,
  });
});

const getColumnsByBoard = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user!.userId;
  const boardId = req.params.boardId as string;
  const result = await ColumnService.getColumnsByBoard(userId, boardId);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Columns retrieved successfully",
    data: result,
  });
});

const updateColumn = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user!.userId;
  const columnId = req.params.id as string;
  const result = await ColumnService.updateColumn(userId, columnId, req.body);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Column updated successfully",
    data: result,
  });
});

const deleteColumn = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user!.userId;
  const columnId = req.params.id as string;
  const result = await ColumnService.deleteColumn(userId, columnId);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Column deleted successfully",
    data: result,
  });
});

const reorderColumns = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user!.userId;
  const boardId = req.params.boardId as string;
  const result = await ColumnService.reorderColumns(userId, boardId, req.body);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Columns reordered successfully",
    data: result,
  });
});

export const ColumnController = {
  createColumn,
  getColumnsByBoard,
  updateColumn,
  deleteColumn,
  reorderColumns,
};
