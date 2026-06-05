import { Router } from 'express';
import auth from '../../middlewares/auth';
import { createPoll, vote, getResults, closePoll } from './controller';

const router = Router();

router.post('/:chatId', auth, createPoll);
router.post('/:pollId/vote', auth, vote);
router.get('/:pollId/results', auth, getResults);
router.patch('/:pollId/close', auth, closePoll);

export default router;
