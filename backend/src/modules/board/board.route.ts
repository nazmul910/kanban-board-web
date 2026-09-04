import { Router } from "express";
import verifyToken from "../../middleware/verifyToken";
import validateRequest from "../../middleware/validateRequest";
import { BoardValidation } from "./board.validation";
import { BoardController } from "./board.controller";

const router = Router();

router.post(
  "/",
  verifyToken,
  validateRequest(BoardValidation.createBoardValidationSchema),
  BoardController.createBoard
);

router.get(
  "/",
  verifyToken,
  BoardController.getUserBoards
);

router.get(
  "/:id",
  verifyToken,
  BoardController.getSingleBoard
);

router.patch(
  "/:id",
  verifyToken,
  validateRequest(BoardValidation.updateBoardValidationSchema),
  BoardController.updateBoard
);

router.delete(
  "/:id",
  verifyToken,
  BoardController.deleteBoard
);

// Board Sharing & Member Management
router.post(
  "/:id/members",
  verifyToken,
  validateRequest(BoardValidation.shareBoardValidationSchema),
  BoardController.shareBoard
);

router.patch(
  "/:id/members/:memberId",
  verifyToken,
  validateRequest(BoardValidation.updateMemberRoleValidationSchema),
  BoardController.updateMemberRole
);

router.delete(
  "/:id/members/:memberId",
  verifyToken,
  BoardController.removeMember
);

export const BoardRoutes = router;
export default router;
