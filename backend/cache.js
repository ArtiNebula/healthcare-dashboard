const Redis = require("ioredis");

const client = new Redis({
  host: process.env.REDIS_HOST || "localhost",
  port: parseInt(process.env.REDIS_PORT || "6379"),
  // Gracefully disable cache if Redis is unavailable (dev without Redis)
  lazyConnect: true,
  retryStrategy: () => null,
});

client.on("error", () => {}); // suppress connection errors when Redis not present

async function getCache(key) {
  try {
    const val = await client.get(key);
    return val ? JSON.parse(val) : null;
  } catch {
    return null;
  }
}

async function setCache(key, data, ttlSeconds = 30) {
  try {
    await client.set(key, JSON.stringify(data), "EX", ttlSeconds);
  } catch {
    // Cache write failure is non-fatal
  }
}

async function delCache(key) {
  try {
    await client.del(key);
  } catch {}
}

module.exports = { getCache, setCache, delCache };
