"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = __importDefault(require("../../middlewares/auth"));
const controller_1 = require("./controller");
const router = (0, express_1.Router)();
router.post('/sessions/:sessionId/bet', auth_1.default, controller_1.placeBet);
router.get('/transactions', auth_1.default, controller_1.getTransactions);
router.get('/leaderboard', auth_1.default, controller_1.getLeaderboard);
exports.default = router;
//# sourceMappingURL=route.js.map