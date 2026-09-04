import { Request, Response } from "express";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { TaskService } from "./task.service";

const createTask = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user!.userId;
  const result = await TaskService.createTask(userId, req.body);

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "Task created successfully",
    data: result,
  });
});

const getSingleTask = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user!.userId;
  const taskId = (req.params.id || req.params.taskId) as string;
  const result = await TaskService.getSingleTask(userId, taskId);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Task retrieved successfully",
    data: result,
  });
});

const updateTask = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user!.userId;
  const taskId = (req.params.id || req.params.taskId) as string;
  const result = await TaskService.updateTask(userId, taskId, req.body);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Task updated successfully",
    data: result,
  });
});

const deleteTask = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user!.userId;
  const taskId = (req.params.id || req.params.taskId) as string;
  const result = await TaskService.deleteTask(userId, taskId);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Task deleted successfully",
    data: result,
  });
});

const moveTask = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user!.userId;
  const taskId = (req.params.id || req.params.taskId) as string;
  const result = await TaskService.moveTask(userId, taskId, req.body);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Task moved successfully",
    data: result,
  });
});

export const TaskController = {
  createTask,
  getSingleTask,
  updateTask,
  deleteTask,
  moveTask,
};
