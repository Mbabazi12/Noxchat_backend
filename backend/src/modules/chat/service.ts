// sendMessage(chatId: string, senderId: string, data: SendMessageDto): Promise<Message>
// getMessages(chatId: string, filters: MessageFilters): Promise<Message[]>
// deleteForEveryone(messageId: string, userId: string): Promise<void>   -- 2-min window
// deleteForMe(messageId: string, userId: string): Promise<void>
// pinMessage(chatId: string, messageId: string, userId: string): Promise<void>  -- max 3
// unpinMessage(chatId: string, messageId: string): Promise<void>
// markAsRead(chatId: string, userId: string): Promise<void>
// forwardMessage(messageId: string, toChatId: string, userId: string): Promise<Message>
// getOrCreateDirect(userId: string, targetId: string): Promise<Chat>
// searchMessages(chatId: string, query: SearchQuery): Promise<Message[]>
// getThrowback(chatId: string): Promise<Message | null>   -- random msg from 1 year ago
