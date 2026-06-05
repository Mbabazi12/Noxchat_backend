import { Router } from 'express';
import auth from '../../middlewares/auth';
import {
  createStatus, getStatuses, viewStatus, reactToStatus,
  replyToStatus, getViewers, hideFromUser, deleteStatus,
} from './controller';

const router = Router();

router.post('/', auth, createStatus);
router.get('/', auth, getStatuses);
router.post('/:statusId/view', auth, viewStatus);
router.post('/:statusId/react', auth, reactToStatus);
router.post('/:statusId/reply', auth, replyToStatus);
router.get('/:statusId/viewers', auth, getViewers);
router.patch('/:statusId/hide/:targetUserId', auth, hideFromUser);
router.delete('/:statusId', auth, deleteStatus);

export default router;
