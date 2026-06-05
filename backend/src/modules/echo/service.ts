// sendEcho(chatId: string, senderId: string, content: string): Promise<Echo>  -- 1/hr per person
// reactToEcho(echoId: string, userId: string, emoji: '✅'|'❓'|'🔥'): Promise<void>
// getPendingReactions(echoId: string, senderId: string): Promise<User[]>
// voteDisable(chatId: string, userId: string): Promise<void>  -- 50% → disabled for 24h
// expireEchos(): Promise<void>  -- cron: deactivate past 24h
