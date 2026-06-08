"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = __importDefault(require("../../middlewares/auth"));
const controller_1 = require("./controller");
const router = (0, express_1.Router)();
router.post('/groups/:groupId/vote-enable', auth_1.default, controller_1.voteEnableMode);
router.post('/groups/:groupId', auth_1.default, controller_1.postConfession);
router.get('/groups/:groupId', auth_1.default, controller_1.getConfessions);
router.post('/:confessionId/vote', auth_1.default, controller_1.voteConfession);
router.post('/:confessionId/report', auth_1.default, controller_1.reportConfession);
exports.default = router;
//# sourceMappingURL=route.js.map