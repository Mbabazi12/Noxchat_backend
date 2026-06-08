"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserModel = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const GhostScheduleSchema = new mongoose_1.Schema({
    start: { type: String },
    end: { type: String },
}, { _id: false });
const GhostModeSchema = new mongoose_1.Schema({
    enabled: { type: Boolean, default: false },
    schedule: { type: GhostScheduleSchema, default: {} },
    whitelist: [{ type: mongoose_1.Schema.Types.ObjectId, ref: 'User' }],
}, { _id: false });
const NotificationSettingsSchema = new mongoose_1.Schema({
    notifications: { type: Boolean, default: true },
    dataSaver: { type: Boolean, default: false },
}, { _id: false });
const UserSchema = new mongoose_1.Schema({
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, trim: true, lowercase: true },
    password: { type: String, required: true },
    dob: { type: Date, required: true },
    avatar: { type: String, default: '' },
    onlineStatus: { type: Boolean, default: false },
    lastSeen: { type: Date, default: Date.now },
    ghostMode: { type: GhostModeSchema, default: { enabled: false, whitelist: [] } },
    noxCoins: { type: Number, default: 0 },
    dailyCoinLastClaimed: { type: Date },
    settings: { type: NotificationSettingsSchema, default: () => ({ notifications: true, dataSaver: false }) },
    blockedUsers: [{ type: mongoose_1.Schema.Types.ObjectId, ref: 'User' }],
    mutedUsers: [{ type: mongoose_1.Schema.Types.ObjectId, ref: 'User' }],
    weeklyBadge: { type: Boolean, default: false },
    lastWeeklyBadgeAwarded: { type: Date },
    deletedAt: { type: Date },
    pendingDeletionAt: { type: Date },
    isDeleted: { type: Boolean, default: false },
}, {
    timestamps: true,
});
UserSchema.index({ noxCoins: -1 });
UserSchema.index({ pendingDeletionAt: 1 });
exports.UserModel = mongoose_1.default.models.User || mongoose_1.default.model('User', UserSchema);
//# sourceMappingURL=model.js.map