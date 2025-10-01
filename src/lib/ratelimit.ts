// src/lib/ratelimit.ts
// Token bucket simples em memória (ok pra Vercel dev; em prod prefira Upstash Rate Limit)
type Bucket = { tokens: number; updated: number };
const buckets = new Map<string, Bucket>();

export function rateLimit(key: string, limit = 10, intervalMs = 60_000) {
  const now = Date.now();
  const b = buckets.get(key) ?? { tokens: limit, updated: now };
  const elapsed = now - b.updated;
  const refill = Math.floor(elapsed / intervalMs) * limit;
  b.tokens = Math.min(limit, b.tokens + (refill > 0 ? refill : 0));
  b.updated = refill > 0 ? now : b.updated;

  if (b.tokens <= 0) {
    buckets.set(key, b);
    return { allowed: false, remaining: 0 };
  }
  b.tokens -= 1;
  buckets.set(key, b);
  return { allowed: true, remaining: b.tokens };
}
