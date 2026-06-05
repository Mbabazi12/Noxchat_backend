// GameSession schema:
// type: 'tic_tac_toe'|'quiz_battle'|'drawing_guess'|'truth_dare'|'chess'|'sudoku'|'2048'|'wordle'
// chatId: ObjectId | null  -- null for solo games
// players: ObjectId[], spectators: ObjectId[]
// state: Record<string, unknown>  -- flexible per game type
// status: 'waiting'|'active'|'finished'
// winnerId: ObjectId, currentTurn: ObjectId
// result: Record<string, unknown>
// createdAt: Date, finishedAt: Date
