const rateLimit = require('express-rate-limit');

// Rate limiting configuration
const createRateLimiter = (windowMs = 15 * 60 * 1000, max = 100) => {
    return rateLimit({
        windowMs, // Time window in milliseconds
        max, // Max requests per window
        message: {
            success: false,
            message: 'Too many requests from this IP, please try again later.'
        },
        standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
        legacyHeaders: false, // Disable the `X-RateLimit-*` headers
        // Skip rate limiting for certain IPs (optional)
        skip: (req) => {
            // You can add whitelisted IPs here
            return false;
        }
    });
};

// Stricter rate limiter for write operations
const strictRateLimiter = createRateLimiter(15 * 60 * 1000, 50); // 50 requests per 15 minutes

// General rate limiter
const generalRateLimiter = createRateLimiter(15 * 60 * 1000, 100); // 100 requests per 15 minutes

module.exports = {
    strictRateLimiter,
    generalRateLimiter
};
