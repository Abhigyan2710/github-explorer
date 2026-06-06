/**
 * Simple in-memory cache with TTL (time-to-live) support.
 * If the same key is requested within TTL seconds, the cached
 * response is returned instead of hitting GitHub again.
 */

const cache = new Map();
const DEFAULT_TTL = 60; // seconds

const get = (key) => {
  const entry = cache.get(key);
  if (!entry) return null;
  const isExpired = Date.now() > entry.expiresAt;
  if (isExpired) {
    cache.delete(key);
    return null;
  }
  return entry.data;
};

const set = (key, data, ttl = DEFAULT_TTL) => {
  cache.set(key, {
    data,
    expiresAt: Date.now() + ttl * 1000,
  });
};

const clear = () => cache.clear();

const size = () => cache.size;

module.exports = { get, set, clear, size };
