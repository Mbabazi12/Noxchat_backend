"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = __importDefault(require("../../middlewares/auth"));
const controller_1 = require("./controller");
const router = (0, express_1.Router)();
router.post('/', auth_1.default, controller_1.createStatus);
router.get('/', auth_1.default, controller_1.getStatuses);
router.post('/:statusId/view', auth_1.default, controller_1.viewStatus);
router.post('/:statusId/react', auth_1.default, controller_1.reactToStatus);
router.post('/:statusId/reply', auth_1.default, controller_1.replyToStatus);
router.get('/:statusId/viewers', auth_1.default, controller_1.getViewers);
router.patch('/:statusId/hide/:targetUserId', auth_1.default, controller_1.hideFromUser);
router.delete('/:statusId', auth_1.default, controller_1.deleteStatus);
exports.default = router;
//# sourceMappingURL=route.js.map