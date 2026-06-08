"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = __importDefault(require("../../middlewares/auth"));
const controller_1 = require("./controller");
const router = (0, express_1.Router)();
router.post('/sessions', auth_1.default, controller_1.createSession);
router.get('/sessions/:sessionId', auth_1.default, controller_1.getSession);
router.post('/sessions/:sessionId/join', auth_1.default, controller_1.joinSession);
router.post('/sessions/:sessionId/spectate', auth_1.default, controller_1.spectateSession);
router.post('/sessions/:sessionId/move', auth_1.default, controller_1.makeMove);
router.post('/sessions/:sessionId/share', auth_1.default, controller_1.shareScore);
router.get('/daily/:type', auth_1.default, controller_1.getDailyChallenge);
exports.default = router;
//# sourceMappingURL=route.js.map