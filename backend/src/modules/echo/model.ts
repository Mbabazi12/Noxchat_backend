// Echo schema:
// chatId: ObjectId, senderId: ObjectId
// content: string, lockedMessageCount: number  -- default 10
// reactions: { userId: ObjectId, emoji: '✅'|'❓'|'🔥' }[]
// expiresAt: Date  -- 24h after send
// active: boolean
// createdAt: Date
