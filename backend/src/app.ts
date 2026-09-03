import express, { Application, Request, Response } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

import router from "./app/router";

import globalErrorHandler from "./app/middleware/globalErrorHandler";
import notFound from "./app/middleware/notFound";

const app: Application = express();

app.use(
  cors({
    origin: true,
    credentials: true,
  })
);

app.use(cookieParser());

app.use(express.json());

app.use(
  express.urlencoded({
    extended: true,
  })
);


app.get("/", (req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: "Kanban Board Backend is running",
  });
});


app.use("/api/v1", router);


app.use(notFound);


app.use(globalErrorHandler);

export default app;