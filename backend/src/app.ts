import express, { Application, Request, Response } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app: Application = express();

// Global Middlewares
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    credentials: true,
  })
);
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Temporary Health Check Route (main /api/v1 router পরের Step-এ বসবে)
app.get("/", (req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: "Mini Kanban Board Backend is running",
  });
});

export default app;