import { Router } from 'express';
import auth from '../../middlewares/auth';
import { placeBet, getTransactions, getLeaderboard } from './controller';

const router = Router();

router.post('/sessions/:sessionId/bet', auth, placeBet);
router.get('/transactions', auth, getTransactions);
router.get('/leaderboard', auth, getLeaderboard);

export default router;
