import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

// Graceful fallback if Upstash environment variables are not provided
const isUpstashConfigured = 
  process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN;

// Create a new ratelimiter, that allows 10 requests per 10 seconds per IP
export const rateLimit = isUpstashConfigured
  ? new Ratelimit({
      redis: Redis.fromEnv(),
      limiter: Ratelimit.slidingWindow(10, "10 s"),
      analytics: true,
    })
  : {
      // Mock rate limiter that always allows requests if Redis is not configured
      limit: async () => ({ success: true }),
    };
