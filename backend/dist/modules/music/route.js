"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = __importDefault(require("../../middlewares/auth"));
const upload_1 = __importDefault(require("../../config/upload"));
const controller_1 = require("./controller");
const router = (0, express_1.Router)();
router.post('/songs', auth_1.default, upload_1.default.single('file'), controller_1.uploadSong);
router.get('/songs', auth_1.default, controller_1.getSongs);
router.delete('/songs/:songId', auth_1.default, controller_1.deleteSong);
router.post('/rooms', auth_1.default, controller_1.createRoom);
router.get('/rooms/:token', auth_1.default, controller_1.getRoom);
router.post('/rooms/join/:token', auth_1.default, controller_1.joinRoom);
router.post('/rooms/:roomId/leave', auth_1.default, controller_1.leaveRoom);
router.post('/rooms/:roomId/control', auth_1.default, controller_1.hostControl);
router.post('/rooms/:roomId/request', auth_1.default, controller_1.requestSong);
router.put('/rooms/:roomId/request/:requestId', auth_1.default, controller_1.approveRequest);
exports.default = router;
//# sourceMappingURL=route.js.map