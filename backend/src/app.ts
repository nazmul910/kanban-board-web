import express, { Application, Request, Response } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

import router from "./routes";
import globalErrorHandler from "./middleware/globalErrorHandler";
import notFound from "./middleware/notFound";
import config from "./config";

const app: Application = express();

app.use(
  cors({
    origin: config.frontendUrl || true,
    credentials: true,
  })
);

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: "Mini Kanban Board Backend API is running",
  });
});

// Mount routes for both /api and /api/v1
app.use("/api", router);
app.use("/api/v1", router);

// Error handlers
app.use(notFound);
app.use(globalErrorHandler);

export default app;