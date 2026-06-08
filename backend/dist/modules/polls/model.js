"use strict";
// Poll schema:
// chatId: ObjectId, creatorId: ObjectId
// question: string, options: { text: string, votes: ObjectId[] }[]
// type: 'single'|'multiple'
// anonymous: boolean, showResultsImmediately: boolean
// expiresAt: Date  -- 1h | 1d | 1w
// closed: boolean, createdAt: Date
//# sourceMappingURL=model.js.map