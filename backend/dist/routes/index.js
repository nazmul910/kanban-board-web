"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_route_1 = __importDefault(require("../modules/auth/auth.route"));
const board_route_1 = __importDefault(require("../modules/board/board.route"));
const column_route_1 = __importDefault(require("../modules/column/column.route"));
const task_route_1 = __importDefault(require("../modules/task/task.route"));
const activity_route_1 = __importDefault(require("../modules/activity/activity.route"));
const router = (0, express_1.Router)();
const moduleRoutes = [
    {
        path: "/auth",
        route: auth_route_1.default,
    },
    {
        path: "/boards",
        route: board_route_1.default,
    },
    {
        path: "/columns",
        route: column_route_1.default,
    },
    {
        path: "/tasks",
        route: task_route_1.default,
    },
    {
        path: "/activities",
        route: activity_route_1.default,
    },
];
moduleRoutes.forEach((route) => {
    router.use(route.path, route.route);
});
exports.default = router;
//# sourceMappingURL=index.js.map