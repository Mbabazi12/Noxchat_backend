// GameSession schema fields:
// type (tic_tac_toe|quiz_battle|drawing_guess|truth_dare|chess|sudoku|2048|wordle)
// chatId (ref: Chat, nullable for solo), players [userId], spectators [userId]
// state: Object   -- flexible per game type
// status (waiting|active|finished)
// winnerId (ref: User)
// result: Object  -- score summary
// currentTurn (ref: User)
// createdAt, finishedAt
