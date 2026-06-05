// Message schema:
// chatId: ObjectId, senderId: ObjectId, type: 'text'|'image'|'video'|'audio'|'file'|'voice_note'
// content: string, mediaUrl: string
// transcription: { text: string, language: string, edited: boolean }
// replyTo: ObjectId, forwardedFrom: ObjectId
// readBy: { userId: ObjectId, readAt: Date }[]
// deletedFor: ObjectId[], deletedForEveryone: boolean, deletedAt: Date
// isEcho: boolean, isPinned: boolean, isAnonymous: boolean
// reactions: { userId: ObjectId, emoji: string }[]
// reportCount: number, reportedBy: ObjectId[], hidden: boolean
// createdAt: Date

// Chat schema:
// type: 'direct'|'group', members: ObjectId[]
// pinnedMessages: { msgId: ObjectId, pinnedAt: Date }[]
// createdAt: Date
