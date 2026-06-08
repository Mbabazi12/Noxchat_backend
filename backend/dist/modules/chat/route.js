"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = __importDefault(require("../../middlewares/auth"));
const controller_1 = require("./controller");
const router = (0, express_1.Router)();
router.post('/:chatId/messages', auth_1.default, controller_1.sendMessage);
router.get('/:chatId/messages', auth_1.default, controller_1.getMessages);
router.delete('/messages/:messageId/everyone', auth_1.default, controller_1.deleteForEveryone);
router.delete('/messages/:messageId/me', auth_1.default, controller_1.deleteForMe);
router.post('/messages/:messageId/forward', auth_1.default, controller_1.forwardMessage);
router.post('/:chatId/pin/:messageId', auth_1.default, controller_1.pinMessage);
router.delete('/:chatId/pin/:messageId', auth_1.default, controller_1.unpinMessage);
router.post('/:chatId/read', auth_1.default, controller_1.markAsRead);
router.post('/direct/:targetId', auth_1.default, controller_1.getOrCreateDirect);
router.get('/:chatId/search', auth_1.default, controller_1.searchMessages);
router.get('/:chatId/throwback', auth_1.default, controller_1.getThrowback);
exports.default = router;
//# sourceMappingURL=route.js.map