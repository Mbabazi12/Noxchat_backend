"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTransactions = exports.getLeaderboard = exports.claimDailyCoins = exports.setGhostMode = exports.muteUser = exports.unblockUser = exports.blockUser = exports.deleteMe = exports.updateMe = exports.getMe = void 0;
const service_1 = require("./service");
const response_1 = require("../../utils/response");
const getUserId = (req) => {
    const id = req.user?.id || req.user?.sub;
    if (!id || typeof id !== 'string') {
        throw new Error('Unauthorized');
    }
    return id;
};
const getMe = async (req, res) => {
    try {
        const userId = getUserId(req);
        const profile = await (0, service_1.getProfile)(userId);
        if (!profile) {
            (0, response_1.error)(res, 'Profile not found', 404);
            return;
        }
        (0, response_1.success)(res, profile);
    }
    catch (err) {
        (0, response_1.error)(res, err.message, 400);
    }
};
exports.getMe = getMe;
const updateMe = async (req, res) => {
    try {
        const userId = getUserId(req);
        const profile = await (0, service_1.updateProfile)(userId, req.body);
        if (!profile) {
            (0, response_1.error)(res, 'Unable to update profile', 404);
            return;
        }
        (0, response_1.success)(res, profile);
    }
    catch (err) {
        (0, response_1.error)(res, err.message, 400);
    }
};
exports.updateMe = updateMe;
const deleteMe = async (req, res) => {
    try {
        const userId = getUserId(req);
        await (0, service_1.deleteAccount)(userId);
        (0, response_1.success)(res, { message: 'Account scheduled for deletion within 7 days' });
    }
    catch (err) {
        (0, response_1.error)(res, err.message, 400);
    }
};
exports.deleteMe = deleteMe;
const blockUser = async (req, res) => {
    try {
        const userId = getUserId(req);
        const targetId = req.params.targetId;
        await (0, service_1.blockUser)(userId, targetId);
        (0, response_1.success)(res, { message: 'User blocked' });
    }
    catch (err) {
        (0, response_1.error)(res, err.message, 400);
    }
};
exports.blockUser = blockUser;
const unblockUser = async (req, res) => {
    try {
        const userId = getUserId(req);
        const targetId = req.params.targetId;
        await (0, service_1.unblockUser)(userId, targetId);
        (0, response_1.success)(res, { message: 'User unblocked' });
    }
    catch (err) {
        (0, response_1.error)(res, err.message, 400);
    }
};
exports.unblockUser = unblockUser;
const muteUser = async (req, res) => {
    try {
        const userId = getUserId(req);
        const targetId = req.params.targetId;
        await (0, service_1.muteUser)(userId, targetId);
        (0, response_1.success)(res, { message: 'User muted' });
    }
    catch (err) {
        (0, response_1.error)(res, err.message, 400);
    }
};
exports.muteUser = muteUser;
const setGhostMode = async (req, res) => {
    try {
        const userId = getUserId(req);
        const ghostMode = await (0, service_1.setGhostMode)(userId, req.body);
        (0, response_1.success)(res, ghostMode);
    }
    catch (err) {
        (0, response_1.error)(res, err.message, 400);
    }
};
exports.setGhostMode = setGhostMode;
const claimDailyCoins = async (req, res) => {
    try {
        const userId = getUserId(req);
        const totalCoins = await (0, service_1.claimDailyCoins)(userId);
        (0, response_1.success)(res, { noxCoins: totalCoins });
    }
    catch (err) {
        (0, response_1.error)(res, err.message, 400);
    }
};
exports.claimDailyCoins = claimDailyCoins;
const getLeaderboard = async (_req, res) => {
    try {
        const leaderboard = await (0, service_1.getLeaderboard)();
        (0, response_1.success)(res, leaderboard);
    }
    catch (err) {
        (0, response_1.error)(res, err.message, 400);
    }
};
exports.getLeaderboard = getLeaderboard;
const getTransactions = async (req, res) => {
    try {
        const userId = getUserId(req);
        const transactions = await (0, service_1.getTransactionHistory)(userId);
        (0, response_1.success)(res, transactions);
    }
    catch (err) {
        (0, response_1.error)(res, err.message, 400);
    }
};
exports.getTransactions = getTransactions;
//# sourceMappingURL=controller.js.map