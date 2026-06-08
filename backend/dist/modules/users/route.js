"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = __importDefault(require("../../middlewares/auth"));
const controller_1 = require("./controller");
const router = (0, express_1.Router)();
router.get('/me', auth_1.default, controller_1.getMe);
router.put('/me', auth_1.default, controller_1.updateMe);
router.delete('/me', auth_1.default, controller_1.deleteMe);
router.post('/block/:targetId', auth_1.default, controller_1.blockUser);
router.delete('/block/:targetId', auth_1.default, controller_1.unblockUser);
router.post('/mute/:targetId', auth_1.default, controller_1.muteUser);
router.post('/ghost-mode', auth_1.default, controller_1.setGhostMode);
router.post('/daily-coins', auth_1.default, controller_1.claimDailyCoins);
router.get('/leaderboard', auth_1.default, controller_1.getLeaderboard);
router.get('/transactions', auth_1.default, controller_1.getTransactions);
exports.default = router;
//# sourceMappingURL=route.js.map