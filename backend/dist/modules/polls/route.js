"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = __importDefault(require("../../middlewares/auth"));
const controller_1 = require("./controller");
const router = (0, express_1.Router)();
router.post('/:chatId', auth_1.default, controller_1.createPoll);
router.post('/:pollId/vote', auth_1.default, controller_1.vote);
router.get('/:pollId/results', auth_1.default, controller_1.getResults);
router.patch('/:pollId/close', auth_1.default, controller_1.closePoll);
exports.default = router;
//# sourceMappingURL=route.js.map