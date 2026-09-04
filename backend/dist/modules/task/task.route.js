"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TaskRoutes = void 0;
const express_1 = require("express");
const verifyToken_1 = __importDefault(require("../../middleware/verifyToken"));
const validateRequest_1 = __importDefault(require("../../middleware/validateRequest"));
const task_validation_1 = require("./task.validation");
const task_controller_1 = require("./task.controller");
const activity_controller_1 = require("../activity/activity.controller");
const router = (0, express_1.Router)();
router.post("/", verifyToken_1.default, (0, validateRequest_1.default)(task_validation_1.TaskValidation.createTaskValidationSchema), task_controller_1.TaskController.createTask);
router.get("/:id", verifyToken_1.default, task_controller_1.TaskController.getSingleTask);
router.patch("/:id", verifyToken_1.default, (0, validateRequest_1.default)(task_validation_1.TaskValidation.updateTaskValidationSchema), task_controller_1.TaskController.updateTask);
router.delete("/:id", verifyToken_1.default, task_controller_1.TaskController.deleteTask);
// Task Movement & Reordering (Same column or across columns)
router.patch("/:id/move", verifyToken_1.default, (0, validateRequest_1.default)(task_validation_1.TaskValidation.moveTaskValidationSchema), task_controller_1.TaskController.moveTask);
// Task Activities
router.get("/:taskId/activities", verifyToken_1.default, activity_controller_1.ActivityController.getTaskActivities);
exports.TaskRoutes = router;
exports.default = router;
//# sourceMappingURL=task.route.js.map