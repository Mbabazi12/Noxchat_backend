import { Router } from 'express';
import auth from '../../middlewares/auth';
import { createList, getLists, addTask, toggleTask, commentTask, archiveList, getTemplates } from './controller';

const router = Router();

router.get('/templates', getTemplates);
router.post('/groups/:groupId', auth, createList);
router.get('/groups/:groupId', auth, getLists);
router.post('/:listId/tasks', auth, addTask);
router.patch('/:listId/tasks/:taskId/toggle', auth, toggleTask);
router.post('/:listId/tasks/:taskId/comments', auth, commentTask);
router.patch('/:listId/archive', auth, archiveList);

export default router;
