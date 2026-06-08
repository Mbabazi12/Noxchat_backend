"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const controller_1 = require("./controller");
const router = (0, express_1.Router)();
router.post('/register', controller_1.register);
router.post('/login', controller_1.login);
router.post('/logout', controller_1.logout);
router.post('/refresh', controller_1.refresh);
exports.default = router;
//# sourceMappingURL=route.js.map