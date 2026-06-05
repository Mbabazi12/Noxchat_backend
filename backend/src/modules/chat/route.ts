import { Router } from 'express';
import auth from '../../middlewares/auth';
import {
  sendMessage, getMessages, deleteForEveryone, deleteForMe,
  forwardMessage, pinMessage, unpinMessage, markAsRead,
  getOrCreateDirect, searchMessages, getThrowback,
} from './controller';

const router = Router();

router.post('/:chatId/messages', auth, sendMessage);
router.get('/:chatId/messages', auth, getMessages);
router.delete('/messages/:messageId/everyone', auth, deleteForEveryone);
router.delete('/messages/:messageId/me', auth, deleteForMe);
router.post('/messages/:messageId/forward', auth, forwardMessage);
router.post('/:chatId/pin/:messageId', auth, pinMessage);
router.delete('/:chatId/pin/:messageId', auth, unpinMessage);
router.post('/:chatId/read', auth, markAsRead);
router.post('/direct/:targetId', auth, getOrCreateDirect);
router.get('/:chatId/search', auth, searchMessages);
router.get('/:chatId/throwback', auth, getThrowback);

export default router;
