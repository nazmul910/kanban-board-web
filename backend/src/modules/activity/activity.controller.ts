import { Request, Response } from "express";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { ActivityService } from "./activity.service";

const getTaskActivities = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user!.userId;
  const taskId = (req.params.taskId || req.params.id) as string;
  const result = await ActivityService.getTaskActivities(userId, taskId);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Task activities retrieved successfully",
    data: result,
  });
});

const getBoardActivities = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user!.userId;
  const boardId = (req.params.boardId || req.params.id) as string;
  const limit = req.query.limit ? Number(req.query.limit) : 50;
  const result = await ActivityService.getBoardActivities(
    userId,
    boardId,
    limit
  );

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Board activities retrieved successfully",
    data: result,
  });
});

export const ActivityController = {
  getTaskActivities,
  getBoardActivities,
};
