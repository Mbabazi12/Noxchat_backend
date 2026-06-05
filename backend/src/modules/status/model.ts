// Status schema:
// userId: ObjectId, type: 'text'|'image'|'video'
// content: string, mediaUrl: string
// reactions: { userId: ObjectId, emoji: '❤️'|'😂'|'😮'|'😢'|'🙏' }[]
// viewers: { userId: ObjectId, viewedAt: Date }[]
// hiddenFrom: ObjectId[]
// expiresAt: Date  -- 24h after post
// createdAt: Date
