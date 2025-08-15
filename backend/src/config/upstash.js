import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';
import dotenv from 'dotenv';
dotenv.config(); // Load environment variables from .env file


// Create a rate limiter instance
// Allows 10 requests per 20 seconds
const ratelimit = new Ratelimit({
    redis: Redis.fromEnv(),
    limiter: Ratelimit.slidingWindow(100, "60 s"),
});

export default ratelimit;