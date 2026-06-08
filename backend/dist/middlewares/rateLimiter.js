"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.apiLimiter = exports.messageLimiter = void 0;
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
exports.messageLimiter = (0, express_rate_limit_1.default)({
    windowMs: 10 * 1000,
    max: 20,
    message: { message: 'Too many messages. You are muted for 1 hour.' },
});
exports.apiLimiter = (0, express_rate_limit_1.default)({
    windowMs: 15 * 60 * 1000,
    max: 100,
});
//# sourceMappingURL=rateLimiter.js.map