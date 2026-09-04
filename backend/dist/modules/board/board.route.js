"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BoardRoutes = void 0;
const express_1 = require("express");
const verifyToken_1 = __importDefault(require("../../middleware/verifyToken"));
const validateRequest_1 = __importDefault(require("../../middleware/validateRequest"));
const board_validation_1 = require("./board.validation");
const board_controller_1 = require("./board.controller");
const activity_controller_1 = require("../activity/activity.controller");
const router = (0, express_1.Router)();
router.post("/", verifyToken_1.default, (0, validateRequest_1.default)(board_validation_1.BoardValidation.createBoardValidationSchema), board_controller_1.BoardController.createBoard);
router.get("/", verifyToken_1.default, board_controller_1.BoardController.getUserBoards);
router.get("/:id", verifyToken_1.default, board_controller_1.BoardController.getSingleBoard);
router.patch("/:id", verifyToken_1.default, (0, validateRequest_1.default)(board_validation_1.BoardValidation.updateBoardValidationSchema), board_controller_1.BoardController.updateBoard);
router.delete("/:id", verifyToken_1.default, board_controller_1.BoardController.deleteBoard);
// Board Sharing & Member Management
router.post("/:id/members", verifyToken_1.default, (0, validateRequest_1.default)(board_validation_1.BoardValidation.shareBoardValidationSchema), board_controller_1.BoardController.shareBoard);
router.patch("/:id/members/:memberId", verifyToken_1.default, (0, validateRequest_1.default)(board_validation_1.BoardValidation.updateMemberRoleValidationSchema), board_controller_1.BoardController.updateMemberRole);
router.delete("/:id/members/:memberId", verifyToken_1.default, board_controller_1.BoardController.removeMember);
// Board Activities
router.get("/:boardId/activities", verifyToken_1.default, activity_controller_1.ActivityController.getBoardActivities);
exports.BoardRoutes = router;
exports.default = router;
//# sourceMappingURL=board.route.js.map