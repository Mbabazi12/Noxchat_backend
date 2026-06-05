import rateLimit from 'express-rate-limit';

export const messageLimiter = rateLimit({
  windowMs: 10 * 1000,
  max: 20,
  message: { message: 'Too many messages. You are muted for 1 hour.' },
});

export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
});
