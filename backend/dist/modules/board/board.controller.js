"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BoardController = void 0;
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const sendResponse_1 = __importDefault(require("../../utils/sendResponse"));
const board_service_1 = require("./board.service");
const createBoard = (0, catchAsync_1.default)(async (req, res) => {
    const userId = req.user.userId;
    const result = await board_service_1.BoardService.createBoard(userId, req.body);
    (0, sendResponse_1.default)(res, {
        statusCode: 201,
        success: true,
        message: "Board created successfully",
        data: result,
    });
});
const getUserBoards = (0, catchAsync_1.default)(async (req, res) => {
    const userId = req.user.userId;
    const result = await board_service_1.BoardService.getUserBoards(userId);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "Boards retrieved successfully",
        data: result,
    });
});
const getSingleBoard = (0, catchAsync_1.default)(async (req, res) => {
    const userId = req.user.userId;
    const boardId = req.params.id;
    const result = await board_service_1.BoardService.getSingleBoard(userId, boardId);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "Board retrieved successfully",
        data: result,
    });
});
const updateBoard = (0, catchAsync_1.default)(async (req, res) => {
    const userId = req.user.userId;
    const boardId = req.params.id;
    const result = await board_service_1.BoardService.updateBoard(userId, boardId, req.body);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "Board updated successfully",
        data: result,
    });
});
const deleteBoard = (0, catchAsync_1.default)(async (req, res) => {
    const userId = req.user.userId;
    const boardId = req.params.id;
    const result = await board_service_1.BoardService.deleteBoard(userId, boardId);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "Board deleted successfully",
        data: result,
    });
});
const shareBoard = (0, catchAsync_1.default)(async (req, res) => {
    const userId = req.user.userId;
    const boardId = req.params.id;
    const result = await board_service_1.BoardService.shareBoard(userId, boardId, req.body);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "Board shared successfully",
        data: result,
    });
});
const updateMemberRole = (0, catchAsync_1.default)(async (req, res) => {
    const userId = req.user.userId;
    const boardId = req.params.id;
    const memberId = req.params.memberId;
    const result = await board_service_1.BoardService.updateMemberRole(userId, boardId, memberId, req.body);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "Member role updated successfully",
        data: result,
    });
});
const removeMember = (0, catchAsync_1.default)(async (req, res) => {
    const userId = req.user.userId;
    const boardId = req.params.id;
    const memberId = req.params.memberId;
    const result = await board_service_1.BoardService.removeMember(userId, boardId, memberId);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "Member removed successfully",
        data: result,
    });
});
exports.BoardController = {
    createBoard,
    getUserBoards,
    getSingleBoard,
    updateBoard,
    deleteBoard,
    shareBoard,
    updateMemberRole,
    removeMember,
};
//# sourceMappingURL=board.controller.js.map