import { Router } from 'express';
import auth from '../../middlewares/auth';
import {
  getMe, updateMe, deleteMe, blockUser, unblockUser,
  muteUser, setGhostMode, claimDailyCoins, getLeaderboard, getTransactions,
} from './controller';

const router = Router();

router.get('/me', auth, getMe);
router.put('/me', auth, updateMe);
router.delete('/me', auth, deleteMe);
router.post('/block/:targetId', auth, blockUser);
router.delete('/block/:targetId', auth, unblockUser);
router.post('/mute/:targetId', auth, muteUser);
router.post('/ghost-mode', auth, setGhostMode);
router.post('/daily-coins', auth, claimDailyCoins);
router.get('/leaderboard', auth, getLeaderboard);
router.get('/transactions', auth, getTransactions);

export default router;
