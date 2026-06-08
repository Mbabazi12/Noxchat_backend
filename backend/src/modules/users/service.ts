import prisma from "../../config/db";

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
  outcome: "win" | "loss" | "pending";
  createdAt: Date;
  settledAt?: Date | null;
}

const isSameDate = (a?: Date | null, b?: Date): boolean => {
  if (!a || !b) return false;
  const da = new Date(a);
  return da.toDateString() === b.toDateString();
};

const getMondayStart = (date: Date): Date => {
  const monday = new Date(date);
  const day = monday.getDay();
  const diff = (day + 6) % 7;
  monday.setHours(0, 0, 0, 0);
  monday.setDate(monday.getDate() - diff);
  return monday;
};

export const getProfile = async (userId: string) => {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user || user.isDeleted) return null;
  const { password, ...rest } = user as any;
  return rest;
};

export const updateProfile = async (userId: string, data: any) => {
  const allowedFields = ["name", "dob", "avatar", "settings"];
  const updateData: any = {};
  allowedFields.forEach((f) => {
    if (f in data) updateData[f] = data[f];
  });

  const updated = await prisma.user.update({
    where: { id: userId },
    data: updateData,
  });

  const { password, ...rest } = updated as any;
  return rest;
};

export const deleteAccount = async (userId: string): Promise<void> => {
  const now = new Date();
  const scrubbedEmail = `deleted-${userId}@noxchat.local`;

  await prisma.user.update({
    where: { id: userId },
    data: {
      name: "Deleted User",
      email: scrubbedEmail,
      password: "",
      avatar: "",
      onlineStatus: false,
      lastSeen: now,
      ghostModeEnabled: false,
      ghostModeStartTime: null,
      ghostModeEndTime: null,
      ghostWhitelist: [],
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

  await prisma.bet.deleteMany({ where: { userId } });
};

export const blockUser = async (userId: string, targetId: string): Promise<void> => {
  if (userId === targetId) return;
  await prisma.$transaction(async (tx) => {
    const user = await tx.user.findUnique({ where: { id: userId } });
    if (!user || user.isDeleted) return;
    const blocked = (user.blockedUsers || []) as string[];
    if (blocked.includes(targetId)) return;
    blocked.push(targetId);
    await tx.user.update({ where: { id: userId }, data: { blockedUsers: blocked } });
  });
};

export const unblockUser = async (userId: string, targetId: string): Promise<void> => {
  await prisma.$transaction(async (tx) => {
    const user = await tx.user.findUnique({ where: { id: userId } });
    if (!user) return;
    const blocked = (user.blockedUsers || []) as string[];
    const next = blocked.filter((id) => id !== targetId);
    await tx.user.update({ where: { id: userId }, data: { blockedUsers: next } });
  });
};

export const muteUser = async (userId: string, targetId: string): Promise<void> => {
  if (userId === targetId) return;
  await prisma.$transaction(async (tx) => {
    const user = await tx.user.findUnique({ where: { id: userId } });
    if (!user || user.isDeleted) return;
    const muted = (user.mutedUsers || []) as string[];
    if (muted.includes(targetId)) return;
    muted.push(targetId);
    await tx.user.update({ where: { id: userId }, data: { mutedUsers: muted } });
  });
};

export const setGhostMode = async (userId: string, options: GhostModeOptions) => {
  const whitelist = (options.whitelist || []).slice(0, 3);
  const updateData: any = {
    ghostModeEnabled: options.enabled,
    ghostModeStartTime: options.schedule?.start || null,
    ghostModeEndTime: options.schedule?.end || null,
    ghostWhitelist: whitelist,
  };

  const updated = await prisma.user.update({
    where: { id: userId },
    data: updateData,
  });

  return {
    enabled: updated.ghostModeEnabled,
    schedule: { start: updated.ghostModeStartTime, end: updated.ghostModeEndTime },
    whitelist: (updated.ghostWhitelist || []) as string[],
  };
};

export const claimDailyCoins = async (userId: string): Promise<number> => {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user || user.isDeleted) {
    throw new Error('User not found');
  }

  if (isSameDate(user.dailyCoinLastClaimed as any, new Date())) {
    throw new Error('Daily coins already claimed');
  }

  const updated = await prisma.user.update({
    where: { id: userId },
    data: {
      noxCoins: { increment: 5 },
      dailyCoinLastClaimed: new Date(),
    } as any,
  });

  return updated.noxCoins;
};

export const getLeaderboard = async (): Promise<LeaderboardEntry[]> => {
  const now = new Date();
  const currentWeekStart = getMondayStart(now);
  const isMonday = now.getDay() === 1;

  const hasAwardedThisWeek = !!(await prisma.user.findFirst({
    where: { lastWeeklyBadgeAwarded: { gte: currentWeekStart } },
  }));

  if (isMonday && !hasAwardedThisWeek) {
    // reset badges
    await prisma.user.updateMany({
      where: { lastWeeklyBadgeAwarded: { lt: currentWeekStart } },
      data: { weeklyBadge: false },
    });

    const topThree = await prisma.user.findMany({
      where: { isDeleted: false },
      orderBy: { noxCoins: 'desc' },
      take: 3,
      select: { id: true },
    });

    if (topThree.length > 0) {
      const ops = topThree.map((t) =>
        prisma.user.update({
          where: { id: t.id },
          data: { weeklyBadge: true, lastWeeklyBadgeAwarded: currentWeekStart },
        }),
      );
      await prisma.$transaction(ops);
    }
  }

  const leaderboard = await prisma.user.findMany({
    where: { isDeleted: false },
    orderBy: { noxCoins: 'desc' },
    take: 3,
    select: { name: true, noxCoins: true, weeklyBadge: true },
  });

  return leaderboard.map((u, idx) => ({ rank: idx + 1, name: u.name || 'Unknown', noxCoins: u.noxCoins, weeklyBadge: !!u.weeklyBadge }));
};

export const getTransactionHistory = async (userId: string): Promise<TransactionEntry[]> => {
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - 30);

  const transactions = await prisma.bet.findMany({
    where: { userId, createdAt: { gte: cutoff } },
    orderBy: { createdAt: 'desc' },
    select: { amount: true, outcome: true, createdAt: true, settledAt: true },
  });

  return transactions.map((tx) => ({
    amount: tx.amount,
    outcome: tx.outcome as 'win' | 'loss' | 'pending',
    createdAt: tx.createdAt,
    settledAt: tx.settledAt || null,
  }));
};
