import { env } from "@/server/env";

interface RateLimitRecord {
  attempts: number;
  resetAt: number;
}

const memoryRateLimitStore = new Map<string, RateLimitRecord>();

export class RateLimiter {
  /**
   * Check and record a rate limit attempt
   * @param key Unique key e.g. `auth:login:127.0.0.1:user@example.com`
   * @param maxAttempts Maximum allowed attempts (default 5)
   * @param windowSeconds Window in seconds (default 900 = 15m)
   */
  public static async checkLimit(
    key: string,
    maxAttempts: number = 5,
    windowSeconds: number = 900
  ): Promise<{ allowed: boolean; remaining: number; resetInSeconds: number }> {
    // If Upstash Redis is configured, use Upstash REST API
    if (env.UPSTASH_REDIS_REST_URL && env.UPSTASH_REDIS_REST_TOKEN) {
      try {
        const url = `${env.UPSTASH_REDIS_REST_URL}/pipeline`;
        const res = await fetch(url, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${env.UPSTASH_REDIS_REST_TOKEN}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify([
            ["INCR", key],
            ["EXPIRE", key, windowSeconds, "NX"],
            ["TTL", key],
          ]),
        });

        if (res.ok) {
          const results = await res.json();
          const currentCount = results[0]?.result ?? 1;
          const ttl = results[2]?.result ?? windowSeconds;
          return {
            allowed: currentCount <= maxAttempts,
            remaining: Math.max(0, maxAttempts - currentCount),
            resetInSeconds: ttl > 0 ? ttl : windowSeconds,
          };
        }
      } catch (err) {
        console.warn("[RateLimiter] Upstash Redis failed, falling back to in-memory store:", err);
      }
    }

    // Fallback: in-memory store
    const now = Date.now();
    const existing = memoryRateLimitStore.get(key);

    if (!existing || existing.resetAt <= now) {
      memoryRateLimitStore.set(key, {
        attempts: 1,
        resetAt: now + windowSeconds * 1000,
      });
      return {
        allowed: true,
        remaining: maxAttempts - 1,
        resetInSeconds: windowSeconds,
      };
    }

    existing.attempts += 1;
    const remaining = Math.max(0, maxAttempts - existing.attempts);
    const resetInSeconds = Math.ceil((existing.resetAt - now) / 1000);

    return {
      allowed: existing.attempts <= maxAttempts,
      remaining,
      resetInSeconds,
    };
  }

  /**
   * Reset attempts on successful login/action
   */
  public static async resetLimit(key: string): Promise<void> {
    if (env.UPSTASH_REDIS_REST_URL && env.UPSTASH_REDIS_REST_TOKEN) {
      try {
        await fetch(`${env.UPSTASH_REDIS_REST_URL}/del/${encodeURIComponent(key)}`, {
          method: "POST",
          headers: { Authorization: `Bearer ${env.UPSTASH_REDIS_REST_TOKEN}` },
        });
      } catch {
        // ignore
      }
    }
    memoryRateLimitStore.delete(key);
  }
}
