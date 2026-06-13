import { Router } from 'express';
import { register, login, logout, refresh } from './controller';
import auth from '../../middlewares/auth';

const router = Router();

router.post('/register', register);
router.post('/login',    login);
router.post('/refresh',  refresh);
router.post('/logout',   auth, logout);  // requires valid access token

export default router;
