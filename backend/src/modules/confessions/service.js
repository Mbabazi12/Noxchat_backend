// voteEnableMode(groupId, userId, vote)     -- 60% threshold to enable
// postConfession(groupId, userId, content)  -- max 5/day, stores real sender server-side only
// vote(confessionId, userId, type)          -- upvote | downvote
// reportConfession(confessionId, userId)    -- auto-hide at 5 reports in 1 hour
// getConfessions(groupId)                   -- returns without realSenderId
// assignWeeklyAward(groupId)                -- top upvoted → Best Confession badge
// getForModeration(confessionId)            -- returns realSenderId (mod only)
