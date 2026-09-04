import { Router } from "express";
import verifyToken from "../../middleware/verifyToken";
import validateRequest from "../../middleware/validateRequest";
import { TaskValidation } from "./task.validation";
import { TaskController } from "./task.controller";
import { ActivityController } from "../activity/activity.controller";

const router = Router();

router.post(
  "/",
  verifyToken,
  validateRequest(TaskValidation.createTaskValidationSchema),
  TaskController.createTask
);

router.get(
  "/:id",
  verifyToken,
  TaskController.getSingleTask
);

router.patch(
  "/:id",
  verifyToken,
  validateRequest(TaskValidation.updateTaskValidationSchema),
  TaskController.updateTask
);

router.delete(
  "/:id",
  verifyToken,
  TaskController.deleteTask
);

// Task Movement & Reordering (Same column or across columns)
router.patch(
  "/:id/move",
  verifyToken,
  validateRequest(TaskValidation.moveTaskValidationSchema),
  TaskController.moveTask
);

// Task Activities
router.get(
  "/:taskId/activities",
  verifyToken,
  ActivityController.getTaskActivities
);

export const TaskRoutes = router;
export default router;
