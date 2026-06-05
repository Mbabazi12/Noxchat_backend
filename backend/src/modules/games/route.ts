import { Router } from 'express';
import auth from '../../middlewares/auth';
import {
  createSession, joinSession, spectateSession,
  makeMove, shareScore, getDailyChallenge, getSession,
} from './controller';

const router = Router();

router.post('/sessions', auth, createSession);
router.get('/sessions/:sessionId', auth, getSession);
router.post('/sessions/:sessionId/join', auth, joinSession);
router.post('/sessions/:sessionId/spectate', auth, spectateSession);
router.post('/sessions/:sessionId/move', auth, makeMove);
router.post('/sessions/:sessionId/share', auth, shareScore);
router.get('/daily/:type', auth, getDailyChallenge);

export default router;
