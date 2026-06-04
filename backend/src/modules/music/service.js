// uploadSong(userId, file)                  -- max 10MB/song, 50MB total
// getSongs(userId)
// deleteSong(userId, songId)
// createRoom(hostId, songId)                -- generates shareToken
// joinRoom(token, userId)
// leaveRoom(roomId, userId)
// hostControl(roomId, hostId, action)       -- play | pause | seek(positionMs)
// requestSong(roomId, userId, songId)
// approveRequest(roomId, hostId, requestId, approved)
// getRoom(token)
