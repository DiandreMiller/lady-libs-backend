// middlewares/logIncomingRequests.js
const logger = require('../utils/logger');

const SENSITIVE_KEYS = [
  'password',
  'pwd',
  'pass',
  'confirmPassword',
  'email',
  'phoneNumber',
];

function maskEmail(email = '') {
  if (typeof email !== 'string') return '***';
  const [user, domain] = email.split('@');
  if (!domain) return '***';
  const firstChar = user[0] || '';
  return `${firstChar}***@${domain}`;
}

function maskPhone(phone = '') {
  if (typeof phone !== 'string') return '***';
  const digits = phone.replace(/\D/g, '');
  if (digits.length <= 4) return '***';
  const last4 = digits.slice(-4);
  return `***-***-${last4}`;
}

// Recursively sanitize objects/arrays
function sanitizeBody(body) {
  if (body === null || typeof body !== 'object') return body;

  // Handle arrays
  if (Array.isArray(body)) {
    return body.map((item) => sanitizeBody(item));
  }

  const clone = {};

  for (const key of Object.keys(body)) {
    let value = body[key];

    // Recurse into nested structures
    if (value && typeof value === 'object') {
      value = sanitizeBody(value);
    }

    if (SENSITIVE_KEYS.includes(key)) {
      if (key === 'email') {
        clone[key] = maskEmail(value);
      } else if (key === 'phoneNumber') {
        clone[key] = maskPhone(value);
      } else {
        clone[key] = '***REDACTED***';
      }
    } else {
      clone[key] = value;
    }
  }

  return clone;
}

const logIncomingRequest = (req, _res, next) => {
  const { method, originalUrl, body, headers } = req;
  const isProd = process.env.NODE_ENV === 'production';

  // Skip noisy/static endpoints in production
  if (
    isProd &&
    (originalUrl.startsWith('/health') ||
      originalUrl.startsWith('/uploads') ||
      originalUrl.startsWith('/products'))
  ) {
    return next();
  }

  // IP + User-Agent (trust proxy is set in app.js)
  const userAgent = headers['user-agent'] || 'unknown';
  const ip =
    (headers['x-forwarded-for'] &&
      headers['x-forwarded-for'].split(',')[0].trim()) ||
    req.ip ||
    req.socket?.remoteAddress ||
    'unknown';

  logger.request(`➡️ ${method} ${originalUrl} | IP: ${ip} | UA: ${userAgent}`);

  // Log body if present
  if (body && Object.keys(body).length > 0) {
    if (isProd) {
      const safeBody = sanitizeBody(body);
      logger.request(`   Body: ${JSON.stringify(safeBody)}`);
    } else {
      // Dev: log raw body for easier debugging
      logger.log('   Body:', body);
    }
  }

  next();
};

module.exports = logIncomingRequest;