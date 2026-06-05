import { Router } from 'express';
import auth from '../../middlewares/auth';
import upload from '../../config/upload';
import {
  uploadSong, getSongs, deleteSong, createRoom, joinRoom,
  leaveRoom, hostControl, requestSong, approveRequest, getRoom,
} from './controller';

const router = Router();

router.post('/songs', auth, upload.single('file'), uploadSong);
router.get('/songs', auth, getSongs);
router.delete('/songs/:songId', auth, deleteSong);
router.post('/rooms', auth, createRoom);
router.get('/rooms/:token', auth, getRoom);
router.post('/rooms/join/:token', auth, joinRoom);
router.post('/rooms/:roomId/leave', auth, leaveRoom);
router.post('/rooms/:roomId/control', auth, hostControl);
router.post('/rooms/:roomId/request', auth, requestSong);
router.put('/rooms/:roomId/request/:requestId', auth, approveRequest);

export default router;
