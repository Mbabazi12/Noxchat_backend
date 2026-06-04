// sendEcho(chatId, senderId, content)       -- 1 per hour per person
// reactToEcho(echoId, userId, emoji)        -- unlocks next 10 messages for that user
// getPendingReactions(echoId, senderId)     -- list of who hasn't reacted
// voteDisable(chatId, userId)               -- 50% → disable echo for 24h
// expireEchos()                             -- cron: deactivate echoes past 24h
