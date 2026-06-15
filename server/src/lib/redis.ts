import Redis from 'ioredis';

const redisUrl = process.env.REDIS_URL || 'redis://localhost:6379';

// Different redis database for testing to avoid conflicts with development/production data
const redis = new Redis(redisUrl, {
  db: process.env.NODE_ENV === "test" ? 1 : 0,
});

export default redis;