"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTransactionHistory = exports.getLeaderboard = exports.claimDailyCoins = exports.setGhostMode = exports.muteUser = exports.unblockUser = exports.blockUser = exports.deleteAccount = exports.updateProfile = exports.getProfile = void 0;
const mongoose_1 = require("mongoose");
const model_1 = require("./model");
const model_2 = require("../betting/model");
const isSameDate = (a, b) => {
    if (!a || !b)
        return false;
    return a.toDateString() === b.toDateString();
};
const getMondayStart = (date) => {
    const monday = new Date(date);
    const day = monday.getDay();
    const diff = (day + 6) % 7;
    monday.setHours(0, 0, 0, 0);
    monday.setDate(monday.getDate() - diff);
    return monday;
};
const normalizeObjectIds = (ids = []) => {
    return ids
        .filter((id) => mongoose_1.Types.ObjectId.isValid(id))
        .map((id) => new mongoose_1.Types.ObjectId(id));
};
const getProfile = async (userId) => {
    const user = await model_1.UserModel.findOne({ _id: userId, isDeleted: false }).select('-password').lean();
    return user;
};
exports.getProfile = getProfile;
const updateProfile = async (userId, data) => {
    const allowedUpdates = {};
    const fields = ['name', 'dob', 'avatar', 'settings'];
    fields.forEach((field) => {
        if (field in data) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            allowedUpdates[field] = data[field];
        }
    });
    const updated = await model_1.UserModel.findOneAndUpdate({ _id: userId, isDeleted: false }, { $set: allowedUpdates }, { new: true, runValidators: true, select: '-password' }).lean();
    return updated;
};
exports.updateProfile = updateProfile;
const deleteAccount = async (userId) => {
    const now = new Date();
    const scrubbedEmail = `deleted-${userId}@noxchat.local`;
    await model_1.UserModel.updateOne({ _id: userId }, {
        $set: {
            name: 'Deleted User',
            email: scrubbedEmail,
            password: '',
            avatar: '',
            onlineStatus: false,
            lastSeen: now,
            ghostMode: { enabled: false, whitelist: [] },
            settings: { notifications: false, dataSaver: false },
            blockedUsers: [],
            mutedUsers: [],
            weeklyBadge: false,
            lastWeeklyBadgeAwarded: null,
            dailyCoinLastClaimed: null,
            noxCoins: 0,
            deletedAt: now,
            pendingDeletionAt: new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000),
            isDeleted: true,
        },
    });
    await model_2.BetModel.deleteMany({ userId: new mongoose_1.Types.ObjectId(userId) });
};
exports.deleteAccount = deleteAccount;
const blockUser = async (userId, targetId) => {
    if (userId === targetId)
        return;
    await model_1.UserModel.updateOne({ _id: userId, isDeleted: false }, { $addToSet: { blockedUsers: new mongoose_1.Types.ObjectId(targetId) } });
};
exports.blockUser = blockUser;
const unblockUser = async (userId, targetId) => {
    await model_1.UserModel.updateOne({ _id: userId, isDeleted: false }, { $pull: { blockedUsers: new mongoose_1.Types.ObjectId(targetId) } });
};
exports.unblockUser = unblockUser;
const muteUser = async (userId, targetId) => {
    if (userId === targetId)
        return;
    await model_1.UserModel.updateOne({ _id: userId, isDeleted: false }, { $addToSet: { mutedUsers: new mongoose_1.Types.ObjectId(targetId) } });
};
exports.muteUser = muteUser;
const setGhostMode = async (userId, options) => {
    const whitelist = normalizeObjectIds(options.whitelist || []).slice(0, 3);
    const update = {
        ghostMode: {
            enabled: options.enabled,
            schedule: options.schedule || {},
            whitelist,
        },
    };
    const updated = await model_1.UserModel.findOneAndUpdate({ _id: userId, isDeleted: false }, { $set: update }, { new: true, runValidators: true, select: '-password' }).lean();
    return updated ? updated.ghostMode : null;
};
exports.setGhostMode = setGhostMode;
const claimDailyCoins = async (userId) => {
    const user = await model_1.UserModel.findOne({ _id: userId, isDeleted: false });
    if (!user) {
        throw new Error('User not found');
    }
    if (isSameDate(user.dailyCoinLastClaimed, new Date())) {
        throw new Error('Daily coins already claimed');
    }
    user.noxCoins += 5;
    user.dailyCoinLastClaimed = new Date();
    await user.save();
    return user.noxCoins;
};
exports.claimDailyCoins = claimDailyCoins;
const getLeaderboard = async () => {
    const now = new Date();
    const currentWeekStart = getMondayStart(now);
    const isMonday = now.getDay() === 1;
    const hasAwardedThisWeek = await model_1.UserModel.exists({ lastWeeklyBadgeAwarded: { $gte: currentWeekStart } });
    if (isMonday && !hasAwardedThisWeek) {
        await model_1.UserModel.updateMany({ lastWeeklyBadgeAwarded: { $lt: currentWeekStart } }, { $set: { weeklyBadge: false } });
        const topThree = await model_1.UserModel.find({ isDeleted: false })
            .sort({ noxCoins: -1 })
            .limit(3)
            .select('_id')
            .lean();
        if (topThree.length > 0) {
            const updates = topThree.map((entry) => ({
                updateOne: {
                    filter: { _id: entry._id },
                    update: {
                        weeklyBadge: true,
                        lastWeeklyBadgeAwarded: currentWeekStart,
                    },
                },
            }));
            await model_1.UserModel.bulkWrite(updates);
        }
    }
    const leaderboard = await model_1.UserModel.find({ isDeleted: false })
        .sort({ noxCoins: -1 })
        .limit(3)
        .select('name noxCoins weeklyBadge')
        .lean();
    return leaderboard.map((user, index) => ({
        rank: index + 1,
        name: user.name,
        noxCoins: user.noxCoins,
        weeklyBadge: Boolean(user.weeklyBadge),
    }));
};
exports.getLeaderboard = getLeaderboard;
const getTransactionHistory = async (userId) => {
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - 30);
    const transactions = await model_2.BetModel.find({
        userId: new mongoose_1.Types.ObjectId(userId),
        createdAt: { $gte: cutoff },
    })
        .sort({ createdAt: -1 })
        .select('amount outcome createdAt settledAt')
        .lean();
    return transactions.map((tx) => ({
        amount: tx.amount,
        outcome: tx.outcome,
        createdAt: tx.createdAt,
        settledAt: tx.settledAt,
    }));
};
exports.getTransactionHistory = getTransactionHistory;
//# sourceMappingURL=service.js.map