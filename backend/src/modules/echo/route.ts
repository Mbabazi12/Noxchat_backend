import { Router } from 'express';
import auth from '../../middlewares/auth';
import { sendEcho, reactToEcho, getPendingReactions, voteDisable } from './controller';

const router = Router();

router.post('/:chatId', auth, sendEcho);
router.post('/:echoId/react', auth, reactToEcho);
router.get('/:echoId/pending', auth, getPendingReactions);
router.post('/:chatId/vote-disable', auth, voteDisable);

export default router;
