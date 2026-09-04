import { Request, Response } from "express";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { AuthService } from "./auth.service";
import config from "../../config";

const registerUser = catchAsync(async (req: Request, res: Response) => {
  const result = await AuthService.registerUser(req.body);

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "User registered successfully",
    data: result,
  });
});

const loginUser = catchAsync(async (req: Request, res: Response) => {
  const { user, accessToken } = await AuthService.loginUser(req.body);

  const isProduction = config.env === "production";

  // Set JWT in HTTP-Only Cookie
  res.cookie("accessToken", accessToken, {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? "none" : "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in ms
  });

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "User logged in successfully",
    data: {
      user,
      accessToken,
    },
  });
});

const logoutUser = catchAsync(async (req: Request, res: Response) => {
  const isProduction = config.env === "production";

  // Clear HTTP-Only Cookie
  res.clearCookie("accessToken", {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? "none" : "lax",
  });

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "User logged out successfully",
  });
});

const getCurrentUser = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user!.userId;
  const result = await AuthService.getCurrentUser(userId);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Current user profile fetched successfully",
    data: result,
  });
});

export const AuthController = {
  registerUser,
  loginUser,
  logoutUser,
  getCurrentUser,
};
