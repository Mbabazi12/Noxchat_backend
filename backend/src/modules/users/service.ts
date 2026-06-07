import { Types } from 'mongoose';
import { UserModel, UserDocument, GhostMode } from './model';
import { BetModel } from '../betting/model';

export interface GhostModeOptions {
  enabled: boolean;
  schedule?: {
    start?: string;
    end?: string;
  };
  whitelist?: string[];
}

export interface LeaderboardEntry {
  rank: number;
  name: string;
  noxCoins: number;
  weeklyBadge: boolean;
}

export interface TransactionEntry {
  amount: number;
  outcome: 'win' | 'loss' | 'pending';
  createdAt: Date;
  settledAt?: Date;
}

const isSameDate = (a?: Date, b?: Date): boolean => {
  if (!a || !b) return false;
  return a.toDateString() === b.toDateString();
};

const getMondayStart = (date: Date): Date => {
  const monday = new Date(date);
  const day = monday.getDay();
  const diff = (day + 6) % 7;
  monday.setHours(0, 0, 0, 0);
  monday.setDate(monday.getDate() - diff);
  return monday;
};

const normalizeObjectIds = (ids: string[] = []): Types.ObjectId[] => {
  return ids
    .filter((id) => Types.ObjectId.isValid(id))
    .map((id) => new Types.ObjectId(id));
};

export const getProfile = async (userId: string): Promise<Omit<UserDocument, 'password'> | null> => {
  const user = await UserModel.findOne({ _id: userId, isDeleted: false }).select('-password').lean();
  return user as Omit<UserDocument, 'password'> | null;
};

export const updateProfile = async (userId: string, data: Partial<UserDocument>): Promise<Omit<UserDocument, 'password'> | null> => {
  const allowedUpdates: Partial<UserDocument> = {};
  const fields: Array<keyof UserDocument> = ['name', 'dob', 'avatar', 'settings'];

  fields.forEach((field) => {
    if (field in data) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (allowedUpdates as any)[field] = (data as any)[field];
    }
  });

  const updated = await UserModel.findOneAndUpdate(
    { _id: userId, isDeleted: false },
    { $set: allowedUpdates },
    { new: true, runValidators: true, select: '-password' },
  ).lean();

  return updated as Omit<UserDocument, 'password'> | null;
};

export const deleteAccount = async (userId: string): Promise<void> => {
  const now = new Date();
  const scrubbedEmail = `deleted-${userId}@noxchat.local`;

  await UserModel.updateOne(
    { _id: userId },
    {
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
    },
  );

  await BetModel.deleteMany({ userId: new Types.ObjectId(userId) });
};

export const blockUser = async (userId: string, targetId: string): Promise<void> => {
  if (userId === targetId) return;

  await UserModel.updateOne(
    { _id: userId, isDeleted: false },
    { $addToSet: { blockedUsers: new Types.ObjectId(targetId) } },
  );
};

export const unblockUser = async (userId: string, targetId: string): Promise<void> => {
  await UserModel.updateOne(
    { _id: userId, isDeleted: false },
    { $pull: { blockedUsers: new Types.ObjectId(targetId) } },
  );
};

export const muteUser = async (userId: string, targetId: string): Promise<void> => {
  if (userId === targetId) return;

  await UserModel.updateOne(
    { _id: userId, isDeleted: false },
    { $addToSet: { mutedUsers: new Types.ObjectId(targetId) } },
  );
};

export const setGhostMode = async (userId: string, options: GhostModeOptions): Promise<GhostMode | null> => {
  const whitelist = normalizeObjectIds(options.whitelist || []).slice(0, 3);
  const update: Partial<UserDocument> = {
    ghostMode: {
      enabled: options.enabled,
      schedule: options.schedule || {},
      whitelist,
    } as GhostMode,
  };

  const updated = await UserModel.findOneAndUpdate(
    { _id: userId, isDeleted: false },
    { $set: update },
    { new: true, runValidators: true, select: '-password' },
  ).lean();

  return updated ? (updated.ghostMode as GhostMode) : null;
};

export const claimDailyCoins = async (userId: string): Promise<number> => {
  const user = await UserModel.findOne({ _id: userId, isDeleted: false });
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

export const getLeaderboard = async (): Promise<LeaderboardEntry[]> => {
  const now = new Date();
  const currentWeekStart = getMondayStart(now);
  const isMonday = now.getDay() === 1;

  const hasAwardedThisWeek = await UserModel.exists({ lastWeeklyBadgeAwarded: { $gte: currentWeekStart } });

  if (isMonday && !hasAwardedThisWeek) {
    await UserModel.updateMany(
      { lastWeeklyBadgeAwarded: { $lt: currentWeekStart } },
      { $set: { weeklyBadge: false } },
    );

    const topThree = await UserModel.find({ isDeleted: false })
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
      await UserModel.bulkWrite(updates);
    }
  }

  const leaderboard = await UserModel.find({ isDeleted: false })
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

export const getTransactionHistory = async (userId: string): Promise<TransactionEntry[]> => {
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - 30);

  const transactions = await BetModel.find({
    userId: new Types.ObjectId(userId),
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
