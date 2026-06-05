// createStatus(userId: string, data: CreateStatusDto): Promise<Status>
// getStatuses(viewerId: string): Promise<Status[]>  -- non-expired, not hidden from viewer
// viewStatus(statusId: string, viewerId: string): Promise<void>
// reactToStatus(statusId: string, userId: string, emoji: string): Promise<void>
// replyToStatus(statusId: string, userId: string): Promise<Chat>  -- opens DM
// getViewers(statusId: string, ownerId: string): Promise<Viewer[]>
// hideFromUser(statusId: string, ownerId: string, targetUserId: string): Promise<void>
// deleteStatus(statusId: string, userId: string): Promise<void>
