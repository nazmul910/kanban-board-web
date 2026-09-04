import { Router } from "express";
import authRoutes from "../modules/auth/auth.route";
import boardRoutes from "../modules/board/board.route";

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
];

moduleRoutes.forEach((route) => {
  router.use(route.path, route.route);
});

export default router;