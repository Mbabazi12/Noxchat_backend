const router = require('express').Router();

router.use('/auth',        require('./modules/auth/route'));
router.use('/users',       require('./modules/users/route'));
router.use('/chat',        require('./modules/chat/route'));
router.use('/groups',      require('./modules/groups/route'));
router.use('/confessions', require('./modules/confessions/route'));
router.use('/echo',        require('./modules/echo/route'));
router.use('/games',       require('./modules/games/route'));
router.use('/betting',     require('./modules/betting/route'));
router.use('/diary',       require('./modules/diary/route'));
router.use('/todos',       require('./modules/todos/route'));
router.use('/music',       require('./modules/music/route'));
router.use('/status',      require('./modules/status/route'));
router.use('/polls',       require('./modules/polls/route'));
router.use('/safety',      require('./modules/safety/route'));

module.exports = router;
