import { Document, Model, Types } from 'mongoose';
export interface GhostSchedule {
    start?: string;
    end?: string;
}
export interface GhostMode {
    enabled: boolean;
    schedule?: GhostSchedule;
    whitelist: Types.ObjectId[];
}
export interface NotificationSettings {
    notifications: boolean;
    dataSaver: boolean;
}
export interface UserDocument extends Document {
    name: string;
    email: string;
    password: string;
    dob: Date;
    avatar: string;
    onlineStatus: boolean;
    lastSeen: Date;
    ghostMode: GhostMode;
    noxCoins: number;
    dailyCoinLastClaimed?: Date;
    settings: NotificationSettings;
    blockedUsers: Types.ObjectId[];
    mutedUsers: Types.ObjectId[];
    weeklyBadge: boolean;
    lastWeeklyBadgeAwarded?: Date;
    deletedAt?: Date;
    pendingDeletionAt?: Date;
    isDeleted: boolean;
    createdAt: Date;
    updatedAt: Date;
}
export declare const UserModel: Model<UserDocument>;
//# sourceMappingURL=model.d.ts.map