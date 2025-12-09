// utils/logger.js
const isProd = process.env.NODE_ENV === 'production';

const logger = {
  request: (...args) => {
    // ✅ always show request logs, even in prod
    console.log('[REQ]', ...args);
  },
  log: (...args) => {
    if (!isProd) console.log('[LOG]', ...args);
  },
  info: (...args) => {
    if (!isProd) console.info('[INFO]', ...args);
  },
  warn: (...args) => {
    // show warnings in all environments
    console.warn('[WARN]', ...args);
  },
  error: (...args) => {
    // always show errors
    console.error('[ERROR]', ...args);
  },
};

module.exports = logger;