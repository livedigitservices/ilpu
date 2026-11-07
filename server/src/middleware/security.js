/**
 * Security Middleware Suite:
 * 1. Strict Security Headers (Helmet-equivalent)
 * 2. In-memory Rate Limiting (Brute-force & DDoS mitigation)
 * 3. NoSQL Injection & XSS Input Sanitization
 */

// In-memory rate-limiter store
const rateLimitStore = new Map();

// Periodic cleanup of stale rate-limit buckets every 10 minutes
setInterval(() => {
  const now = Date.now();
  for (const [key, record] of rateLimitStore.entries()) {
    if (now > record.resetTime) {
      rateLimitStore.delete(key);
    }
  }
}, 10 * 60 * 1000);

/**
 * Creates an in-memory sliding window rate limiter
 */
export const createRateLimiter = ({
  windowMs = 15 * 60 * 1000,
  max = 100,
  message = 'Too many requests, please try again later.'
}) => {
  return (req, res, next) => {
    const ip = req.headers['x-forwarded-for']?.split(',')[0].trim() || req.socket.remoteAddress || 'unknown';
    const key = `${req.baseUrl || req.path}:${ip}`;
    const now = Date.now();

    let record = rateLimitStore.get(key);

    if (!record || now > record.resetTime) {
      record = {
        count: 1,
        resetTime: now + windowMs
      };
      rateLimitStore.set(key, record);
    } else {
      record.count += 1;
    }

    res.setHeader('X-RateLimit-Limit', max);
    res.setHeader('X-RateLimit-Remaining', Math.max(0, max - record.count));
    res.setHeader('X-RateLimit-Reset', Math.ceil(record.resetTime / 1000));

    if (record.count > max) {
      return res.status(429).json({
        success: false,
        error: message,
        retryAfterSeconds: Math.ceil((record.resetTime - now) / 1000)
      });
    }

    next();
  };
};

// Specialized Rate Limiters
export const adminLoginLimiter = createRateLimiter({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // 10 attempts
  message: 'Too many admin login attempts from this IP. Please wait 15 minutes before trying again.'
});

export const orderCreationLimiter = createRateLimiter({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 30, // 30 orders
  message: 'Order creation rate limit reached. Please wait a few minutes before trying again.'
});

export const paymentVerificationLimiter = createRateLimiter({
  windowMs: 15 * 60 * 1000,
  max: 40,
  message: 'Payment verification limit reached. If your account was charged, please contact executive support.'
});

/**
 * Security Headers Middleware (Sets secure HTTP response headers)
 */
export const applySecurityHeaders = (req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'SAMEORIGIN');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
  // Allow Razorpay scripts and frames while restricting dangerous origins
  res.setHeader(
    'Content-Security-Policy',
    "default-src 'self' https: data: 'unsafe-inline' 'unsafe-eval'; frame-src 'self' https://api.razorpay.com https://checkout.razorpay.com; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://checkout.razorpay.com https://api.razorpay.com;"
  );
  next();
};

/**
 * Recursive sanitizer to defend against NoSQL injection ($gt, $where) and XSS (<script> tags)
 */
const sanitizeValue = (val) => {
  if (typeof val === 'string') {
    // Strip malicious tags
    return val
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
      .replace(/javascript:/gi, '');
  }
  if (val !== null && typeof val === 'object' && !Array.isArray(val)) {
    const cleaned = {};
    for (const [key, value] of Object.entries(val)) {
      // Disallow Mongo operator injection keys ($where, $ne, $regex)
      if (key.startsWith('$') || key.includes('.')) {
        continue;
      }
      cleaned[key] = sanitizeValue(value);
    }
    return cleaned;
  }
  if (Array.isArray(val)) {
    return val.map(sanitizeValue);
  }
  return val;
};

export const sanitizeInputs = (req, res, next) => {
  if (req.body && typeof req.body === 'object') {
    req.body = sanitizeValue(req.body);
  }
  if (req.query && typeof req.query === 'object') {
    req.query = sanitizeValue(req.query);
  }
  if (req.params && typeof req.params === 'object') {
    req.params = sanitizeValue(req.params);
  }
  next();
};
