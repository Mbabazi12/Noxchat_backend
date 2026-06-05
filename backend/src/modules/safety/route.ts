import { Router } from 'express';
import auth from '../../middlewares/auth';
import { reportContent, getReports, resolveReport } from './controller';

const router = Router();

router.post('/report', auth, reportContent);
router.get('/reports', auth, getReports);           // mod only
router.patch('/reports/:reportId', auth, resolveReport); // mod only

export default router;
