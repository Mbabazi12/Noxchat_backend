import { Router } from 'express';
import auth from '../../middlewares/auth';
import {
  createGroup, getGroup, updateGroup, addMembers, removeMember,
  promoteAdmin, demoteAdmin, leaveGroup, reportGroup, setSleepMode,
} from './controller';

const router = Router();

router.post('/', auth, createGroup);
router.get('/:groupId', auth, getGroup);
router.put('/:groupId', auth, updateGroup);
router.post('/:groupId/members', auth, addMembers);
router.delete('/:groupId/members/:userId', auth, removeMember);
router.post('/:groupId/admins/:userId', auth, promoteAdmin);
router.delete('/:groupId/admins/:userId', auth, demoteAdmin);
router.post('/:groupId/leave', auth, leaveGroup);
router.post('/:groupId/report', auth, reportGroup);
router.put('/:groupId/sleep-mode', auth, setSleepMode);

export default router;
