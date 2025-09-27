// src/lib/rateLimit.ts
type Rec = { count: number; resetAt: number };
const WINDOW_MS = 60_000; // 1 minute
const LIMIT = 10;
const map = new Map<string, Rec>();

export function checkRate(key: string) {
  const now = Date.now();
  const rec = map.get(key);
  if (!rec || rec.resetAt <= now) {
    map.set(key, { count: 1, resetAt: now + WINDOW_MS });
    return { ok: true };
  }
  if (rec.count >= LIMIT) {
    return { ok: false, retryAfter: Math.ceil((rec.resetAt - now) / 1000) };
  }
  rec.count += 1;
  return { ok: true };
}
