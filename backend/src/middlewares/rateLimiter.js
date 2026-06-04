const rateLimit = require('express-rate-limit');

// Spam detection: >20 messages in 10 seconds → muted for 1 hour
const messageLimiter = rateLimit({
  windowMs: 10 * 1000,
  max: 20,
  message: { message: 'Too many messages. You are muted for 1 hour.' }
});

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100
});

module.exports = { messageLimiter, apiLimiter };
