// Message schema fields:
// chatId (ref: Chat), senderId (ref: User), type (text|image|video|audio|file|voice_note)
// content, mediaUrl, transcription { text, language, edited }
// replyTo (ref: Message), forwardedFrom (ref: Message)
// readBy [{ userId, readAt }]
// deletedFor [userId]   -- "delete for me"
// deletedForEveryone: Boolean, deletedAt
// isEcho: Boolean, isPinned: Boolean
// isAnonymous: Boolean (confessions)
// reactions [{ userId, emoji }]
// reportCount, reportedBy [userId], hidden: Boolean
// createdAt

// Chat schema fields:
// type (direct|group), members [userId], pinnedMessages [{ msgId, pinnedAt }]
// createdAt
