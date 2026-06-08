"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = __importDefault(require("../../middlewares/auth"));
const controller_1 = require("./controller");
const router = (0, express_1.Router)();
router.post('/report', auth_1.default, controller_1.reportContent);
router.get('/reports', auth_1.default, controller_1.getReports); // mod only
router.patch('/reports/:reportId', auth_1.default, controller_1.resolveReport); // mod only
exports.default = router;
//# sourceMappingURL=route.js.map