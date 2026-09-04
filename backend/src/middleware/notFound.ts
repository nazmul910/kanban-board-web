import { Request, Response } from "express";

const notFound = (req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    message: "API route not found",
    error: {
      path: req.originalUrl,
    },
  });
};

export default notFound;