// voteEnableMode(groupId: string, userId: string, vote: boolean): Promise<void>  -- 60% threshold
// postConfession(groupId: string, userId: string, content: string): Promise<Confession>  -- max 5/day
// vote(confessionId: string, userId: string, type: 'upvote'|'downvote'): Promise<void>
// reportConfession(confessionId: string, userId: string): Promise<void>  -- auto-hide at 5 in 1h
// getConfessions(groupId: string): Promise<Confession[]>  -- realSenderId omitted
// assignWeeklyAward(groupId: string): Promise<void>
// getForModeration(confessionId: string): Promise<Confession>  -- includes realSenderId
