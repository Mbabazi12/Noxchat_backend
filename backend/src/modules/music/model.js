// Song schema fields:
// ownerId (ref: User), title, filename, size
// createdAt

// ListeningRoom schema fields:
// hostId (ref: User), currentSong (ref: Song), queue [{ songId, requestedBy }]
// listeners [userId], status (active|ended)
// playbackState { isPlaying, positionMs, updatedAt }
// shareToken: String
// createdAt
