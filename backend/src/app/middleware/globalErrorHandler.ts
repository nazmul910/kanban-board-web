import { ErrorRequestHandler } from "express";
import { Prisma } from "@prisma/client";

import AppError from "../utils/AppError";

const globalErrorHandler: ErrorRequestHandler = (
  error,
  req,
  res,
  next
) => {
  let statusCode = 500;

  let message = "Something went wrong";

  let errorDetails: unknown = error;

  if (error instanceof AppError) {
    statusCode = error.statusCode;
    message = error.message;

    errorDetails = {
      message: error.message,
    };
  }

  else if (error instanceof Prisma.PrismaClientValidationError) {
    statusCode = 400;
    message = "Invalid database request";

    errorDetails = {
      message: error.message,
    };
  }

  else if (error instanceof Prisma.PrismaClientKnownRequestError) {
    if (error.code === "P2002") {
      statusCode = 409;
      message = "Duplicate value already exists";

      errorDetails = {
        code: error.code,
        meta: error.meta,
      };
    } else if (error.code === "P2025") {
      statusCode = 404;
      message = "Requested resource was not found";

      errorDetails = {
        code: error.code,
      };
    } else {
      statusCode = 400;
      message = "Database operation failed";

      errorDetails = {
        code: error.code,
        meta: error.meta,
      };
    }
  }


  else if (error instanceof Error) {
    message = error.message;

    errorDetails = {
      message: error.message,
    };
  }


  res.status(statusCode).json({
    success: false,
    message,
    error: errorDetails,
    stack: process.env.NODE_ENV === "development" ? error.stack : undefined,
  });
};

export default globalErrorHandler;