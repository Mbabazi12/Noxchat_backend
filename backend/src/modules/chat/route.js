const router = require('express').Router();

// POST   /api/chat/:chatId/messages
// GET    /api/chat/:chatId/messages
// DELETE /api/chat/messages/:messageId/everyone
// DELETE /api/chat/messages/:messageId/me
// POST   /api/chat/messages/:messageId/forward
// POST   /api/chat/:chatId/pin/:messageId
// DELETE /api/chat/:chatId/pin/:messageId
// POST   /api/chat/:chatId/read
// POST   /api/chat/direct/:targetId
// GET    /api/chat/:chatId/search
// GET    /api/chat/:chatId/throwback

module.exports = router;
