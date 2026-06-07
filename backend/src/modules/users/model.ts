import mongoose, { Schema, Document, Model, Types } from 'mongoose';

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

const GhostScheduleSchema = new Schema<GhostSchedule>({
  start: { type: String },
  end: { type: String },
}, { _id: false });

const GhostModeSchema = new Schema<GhostMode>({
  enabled: { type: Boolean, default: false },
  schedule: { type: GhostScheduleSchema, default: {} },
  whitelist: [{ type: Schema.Types.ObjectId, ref: 'User' }],
}, { _id: false });

const NotificationSettingsSchema = new Schema<NotificationSettings>({
  notifications: { type: Boolean, default: true },
  dataSaver: { type: Boolean, default: false },
}, { _id: false });

const UserSchema = new Schema<UserDocument>({
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
  blockedUsers: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  mutedUsers: [{ type: Schema.Types.ObjectId, ref: 'User' }],
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

export const UserModel: Model<UserDocument> = mongoose.models.User || mongoose.model<UserDocument>('User', UserSchema);
