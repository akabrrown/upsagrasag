import { Redis } from '@upstash/redis';
import { Ratelimit } from '@upstash/ratelimit';

// Initialize the Redis client. 
// It automatically picks up UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN from the environment.
export const redis = Redis.fromEnv();

// Create a generic API rate limiter that allows 10 requests per 10 seconds per IP.
export const ratelimit = new Ratelimit({
  redis: redis,
  limiter: Ratelimit.slidingWindow(10, '10 s'),
  analytics: true,
  // Use a prefix to avoid collisions with other keys
  prefix: '@upstash/ratelimit',
});

// A stricter rate limiter for sensitive endpoints like auth or forms (e.g. 5 requests per minute).
export const strictRatelimit = new Ratelimit({
  redis: redis,
  limiter: Ratelimit.slidingWindow(5, '1 m'),
  analytics: true,
  prefix: '@upstash/strict_ratelimit',
});
