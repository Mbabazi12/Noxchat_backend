"use strict";
// Song schema:
// ownerId: ObjectId, title: string, filename: string, size: number
// createdAt: Date
// ListeningRoom schema:
// hostId: ObjectId, currentSong: ObjectId
// queue: { songId: ObjectId, requestedBy: ObjectId }[]
// listeners: ObjectId[]
// status: 'active'|'ended'
// playbackState: { isPlaying: boolean, positionMs: number, updatedAt: Date }
// shareToken: string
// createdAt: Date
//# sourceMappingURL=model.js.map