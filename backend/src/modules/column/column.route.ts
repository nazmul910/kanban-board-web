import { Router } from "express";
import verifyToken from "../../middleware/verifyToken";
import validateRequest from "../../middleware/validateRequest";
import { ColumnValidation } from "./column.validation";
import { ColumnController } from "./column.controller";

const router = Router();

router.post(
  "/",
  verifyToken,
  validateRequest(ColumnValidation.createColumnValidationSchema),
  ColumnController.createColumn
);

router.get(
  "/board/:boardId",
  verifyToken,
  ColumnController.getColumnsByBoard
);

router.patch(
  "/:id",
  verifyToken,
  validateRequest(ColumnValidation.updateColumnValidationSchema),
  ColumnController.updateColumn
);

router.delete(
  "/:id",
  verifyToken,
  ColumnController.deleteColumn
);

router.patch(
  "/board/:boardId/reorder",
  verifyToken,
  validateRequest(ColumnValidation.reorderColumnsValidationSchema),
  ColumnController.reorderColumns
);

export const ColumnRoutes = router;
export default router;
