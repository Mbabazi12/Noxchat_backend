"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = __importDefault(require("../../middlewares/auth"));
const controller_1 = require("./controller");
const router = (0, express_1.Router)();
router.post('/', auth_1.default, controller_1.createGroup);
router.get('/:groupId', auth_1.default, controller_1.getGroup);
router.put('/:groupId', auth_1.default, controller_1.updateGroup);
router.post('/:groupId/members', auth_1.default, controller_1.addMembers);
router.delete('/:groupId/members/:userId', auth_1.default, controller_1.removeMember);
router.post('/:groupId/admins/:userId', auth_1.default, controller_1.promoteAdmin);
router.delete('/:groupId/admins/:userId', auth_1.default, controller_1.demoteAdmin);
router.post('/:groupId/leave', auth_1.default, controller_1.leaveGroup);
router.post('/:groupId/report', auth_1.default, controller_1.reportGroup);
router.put('/:groupId/sleep-mode', auth_1.default, controller_1.setSleepMode);
exports.default = router;
//# sourceMappingURL=route.js.map