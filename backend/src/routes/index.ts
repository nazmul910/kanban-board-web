import { Router } from "express";
import authRoutes from "../modules/auth/auth.route";
import boardRoutes from "../modules/board/board.route";
import columnRoutes from "../modules/column/column.route";
import taskRoutes from "../modules/task/task.route";
import activityRoutes from "../modules/activity/activity.route";

const router = Router();

const moduleRoutes = [
  {
    path: "/auth",
    route: authRoutes,
  },
  {
    path: "/boards",
    route: boardRoutes,
  },
  {
    path: "/columns",
    route: columnRoutes,
  },
  {
    path: "/tasks",
    route: taskRoutes,
  },
  {
    path: "/activities",
    route: activityRoutes,
  },
];

moduleRoutes.forEach((route) => {
  router.use(route.path, route.route);
});

export default router;