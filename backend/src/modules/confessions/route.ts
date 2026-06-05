import { Router } from 'express';
import auth from '../../middlewares/auth';
import { voteEnableMode, postConfession, voteConfession, reportConfession, getConfessions } from './controller';

const router = Router();

router.post('/groups/:groupId/vote-enable', auth, voteEnableMode);
router.post('/groups/:groupId', auth, postConfession);
router.get('/groups/:groupId', auth, getConfessions);
router.post('/:confessionId/vote', auth, voteConfession);
router.post('/:confessionId/report', auth, reportConfession);

export default router;
