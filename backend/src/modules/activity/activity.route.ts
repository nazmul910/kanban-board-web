import { Router } from "express";
import verifyToken from "../../middleware/verifyToken";
import { ActivityController } from "./activity.controller";

const router = Router();

router.get(
  "/task/:taskId",
  verifyToken,
  ActivityController.getTaskActivities
);

router.get(
  "/board/:boardId",
  verifyToken,
  ActivityController.getBoardActivities
);

export const ActivityRoutes = router;
export default router;
