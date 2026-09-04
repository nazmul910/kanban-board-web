"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ColumnRoutes = void 0;
const express_1 = require("express");
const verifyToken_1 = __importDefault(require("../../middleware/verifyToken"));
const validateRequest_1 = __importDefault(require("../../middleware/validateRequest"));
const column_validation_1 = require("./column.validation");
const column_controller_1 = require("./column.controller");
const router = (0, express_1.Router)();
router.post("/", verifyToken_1.default, (0, validateRequest_1.default)(column_validation_1.ColumnValidation.createColumnValidationSchema), column_controller_1.ColumnController.createColumn);
router.get("/board/:boardId", verifyToken_1.default, column_controller_1.ColumnController.getColumnsByBoard);
router.patch("/:id", verifyToken_1.default, (0, validateRequest_1.default)(column_validation_1.ColumnValidation.updateColumnValidationSchema), column_controller_1.ColumnController.updateColumn);
router.delete("/:id", verifyToken_1.default, column_controller_1.ColumnController.deleteColumn);
router.patch("/board/:boardId/reorder", verifyToken_1.default, (0, validateRequest_1.default)(column_validation_1.ColumnValidation.reorderColumnsValidationSchema), column_controller_1.ColumnController.reorderColumns);
exports.ColumnRoutes = router;
exports.default = router;
//# sourceMappingURL=column.route.js.map