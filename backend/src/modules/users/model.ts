import { Schema, model, Document, Types } from 'mongoose';

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  dob: Date;
  avatar: string;
  onlineStatus: boolean;
  lastSeen: Date;
  ghostMode: {
    enabled: boolean;
    schedule: { start: string; end: string };
    whitelist: Types.ObjectId[];
  };
  noxCoins: number;
  dailyCoinLastClaimed: Date | null;
  settings: {
    notifications: boolean;
    dataSaver: boolean;
  };
  blockedUsers: Types.ObjectId[];
  mutedUsers: Types.ObjectId[];
  weeklyBadge: boolean;
  refreshToken: string | null;
  createdAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    name:     { type: String, required: true, trim: true },
    email:    { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true },
    dob:      { type: Date, required: true },
    avatar:   { type: String, default: '' },

    onlineStatus: { type: Boolean, default: false },
    lastSeen:     { type: Date, default: Date.now },

    ghostMode: {
      enabled:  { type: Boolean, default: false },
      schedule: { start: { type: String, default: '' }, end: { type: String, default: '' } },
      whitelist: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    },

    noxCoins:             { type: Number, default: 100 },
    dailyCoinLastClaimed: { type: Date, default: null },

    settings: {
      notifications: { type: Boolean, default: true },
      dataSaver:     { type: Boolean, default: false },
    },

    blockedUsers: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    mutedUsers:   [{ type: Schema.Types.ObjectId, ref: 'User' }],
    weeklyBadge:  { type: Boolean, default: false },
    refreshToken: { type: String, default: null },
  },
  { timestamps: true }
);

export const User = model<IUser>('User', UserSchema);
