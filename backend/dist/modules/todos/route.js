"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = __importDefault(require("../../middlewares/auth"));
const controller_1 = require("./controller");
const router = (0, express_1.Router)();
router.get('/templates', controller_1.getTemplates);
router.post('/groups/:groupId', auth_1.default, controller_1.createList);
router.get('/groups/:groupId', auth_1.default, controller_1.getLists);
router.post('/:listId/tasks', auth_1.default, controller_1.addTask);
router.patch('/:listId/tasks/:taskId/toggle', auth_1.default, controller_1.toggleTask);
router.post('/:listId/tasks/:taskId/comments', auth_1.default, controller_1.commentTask);
router.patch('/:listId/archive', auth_1.default, controller_1.archiveList);
exports.default = router;
//# sourceMappingURL=route.js.map