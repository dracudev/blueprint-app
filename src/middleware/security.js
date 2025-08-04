const helmet = require("helmet");
const rateLimit = require("express-rate-limit");

const helmetMiddleware = helmet({
  contentSecurityPolicy: false,
  crossOriginEmbedderPolicy: false,
});

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // 100 requests per window
  standardHeaders: true,
  legacyHeaders: false,
  // Skip rate limiting in serverless environments where trust proxy is enabled
  skip: (req) => {
    // Skip rate limiting for serverless environments to avoid proxy issues
    return process.env.NODE_ENV === 'production' && process.env.VERCEL;
  },
  // Custom key generator that works with proxies
  keyGenerator: (req) => {
    // Use the real IP from X-Forwarded-For if available, otherwise fallback to req.ip
    return req.ip || req.connection.remoteAddress || 'unknown';
  },
  handler: (req, res, next) => {
    res.status(429);
    res.render("error", {
      title: "Error",
      user: req.session.user,
      error: {
        status: 429,
        message: "Too many requests, please try again later.",
      },
    });
  },
});

module.exports = {
  helmetMiddleware,
  limiter,
};
