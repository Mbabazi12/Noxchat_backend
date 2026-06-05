// uploadSong(userId: string, file: Express.Multer.File): Promise<Song>  -- max 10MB/song, 50MB total
// getSongs(userId: string): Promise<Song[]>
// deleteSong(userId: string, songId: string): Promise<void>
// createRoom(hostId: string, songId: string): Promise<ListeningRoom>
// joinRoom(token: string, userId: string): Promise<ListeningRoom>
// leaveRoom(roomId: string, userId: string): Promise<void>
// hostControl(roomId: string, hostId: string, action: 'play'|'pause'|'seek', positionMs?: number): Promise<void>
// requestSong(roomId: string, userId: string, songId: string): Promise<void>
// approveRequest(roomId: string, hostId: string, requestId: string, approved: boolean): Promise<void>
// getRoom(token: string): Promise<ListeningRoom>
