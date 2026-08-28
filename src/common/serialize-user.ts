type UserWithRelations = {
  passwordHash?: string;
  blocking?: { targetUserId: string }[];
  muting?: { targetUserId: string }[];
  [key: string]: unknown;
};

export const USER_RELATIONS_INCLUDE = {
  blocking: { select: { targetUserId: true } },
  muting: { select: { targetUserId: true } },
} as const;

export function serializeUser<T extends UserWithRelations>(user: T) {
  const { blocking, muting, passwordHash: _passwordHash, ...rest } = user;
  return {
    ...rest,
    blockedUserIds: (blocking ?? []).map((b) => b.targetUserId),
    mutedUserIds: (muting ?? []).map((m) => m.targetUserId),
  };
}
