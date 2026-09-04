"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ColumnController = void 0;
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const sendResponse_1 = __importDefault(require("../../utils/sendResponse"));
const column_service_1 = require("./column.service");
const createColumn = (0, catchAsync_1.default)(async (req, res) => {
    const userId = req.user.userId;
    const result = await column_service_1.ColumnService.createColumn(userId, req.body);
    (0, sendResponse_1.default)(res, {
        statusCode: 201,
        success: true,
        message: "Column created successfully",
        data: result,
    });
});
const getColumnsByBoard = (0, catchAsync_1.default)(async (req, res) => {
    const userId = req.user.userId;
    const boardId = req.params.boardId;
    const result = await column_service_1.ColumnService.getColumnsByBoard(userId, boardId);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "Columns retrieved successfully",
        data: result,
    });
});
const updateColumn = (0, catchAsync_1.default)(async (req, res) => {
    const userId = req.user.userId;
    const columnId = req.params.id;
    const result = await column_service_1.ColumnService.updateColumn(userId, columnId, req.body);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "Column updated successfully",
        data: result,
    });
});
const deleteColumn = (0, catchAsync_1.default)(async (req, res) => {
    const userId = req.user.userId;
    const columnId = req.params.id;
    const result = await column_service_1.ColumnService.deleteColumn(userId, columnId);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "Column deleted successfully",
        data: result,
    });
});
const reorderColumns = (0, catchAsync_1.default)(async (req, res) => {
    const userId = req.user.userId;
    const boardId = req.params.boardId;
    const result = await column_service_1.ColumnService.reorderColumns(userId, boardId, req.body);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "Columns reordered successfully",
        data: result,
    });
});
exports.ColumnController = {
    createColumn,
    getColumnsByBoard,
    updateColumn,
    deleteColumn,
    reorderColumns,
};
//# sourceMappingURL=column.controller.js.map