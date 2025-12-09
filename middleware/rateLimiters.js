const rateLimit = require('express-rate-limit');
const slowDown = require('express-slow-down');

// ---------------------- LOGIN LIMITERS ---------------------- //
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,    // 15 minutes
  max: 10,                     // 10 attempts per IP per window
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many login attempts. Please try again later.' },
  statusCode: 429,
});

const loginSpeedLimiter = slowDown({
  windowMs: 15 * 60 * 1000,    // same window
  delayAfter: 5,               // start slowing after 5 attempts
  delayMs: 500,                // add 500ms delay per extra attempt
});

// ---------------------- SIGNUP LIMITERS ---------------------- //
const signupLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,    // 1 hour
  max: 20,                     // 20 signups/IP/hour
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many signup requests. Please try again later.' },
});

// slow down signups
const signupSpeedLimiter = slowDown({
  windowMs: 60 * 60 * 1000,
  delayAfter: 10,
  delayMs: 400,
});

// Email limiter
const loginEmailLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5, // e.g., 5 attempts per email per 15 min
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req) => String(req.body?.email || '').trim().toLowerCase(),
  skip: (req) => !req.body?.email, // skip if no email provided
  message: { error: 'Too many attempts for this account. Try again later.' },
});


module.exports = {
  loginLimiter,
  loginSpeedLimiter,
  signupLimiter,
  signupSpeedLimiter,
  loginEmailLimiter,
};