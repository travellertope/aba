// ============================================================
// Edge-friendly rate limiting for public write endpoints.
// Per SECURITY.md §2 (Denial of Wallet): every public form/Server
// Action is a volumetric-attack vector. Uses the Upstash Redis
// REST API directly (no SDK dependency) so this works on the
// Edge runtime as well as Node.
//
// Falls back to "allow" with a loud warning if Upstash isn't
// configured — fine for local dev, NOT fine for production.
// Set UPSTASH_REDIS_REST_URL / UPSTASH_REDIS_REST_TOKEN before
// launching pay.[domain].
// ============================================================
import 'server-only';

const UPSTASH_URL = process.env.UPSTASH_REDIS_REST_URL;
const UPSTASH_TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN;

let warned = false;

/**
 * Fixed-window limiter: `limit` requests per `windowSeconds`, keyed by
 * caller-supplied identifier (e.g. `checkout:<ip>` or `checkout:<email>`).
 */
export async function checkRateLimit(
  key: string,
  limit: number,
  windowSeconds: number,
): Promise<{ allowed: boolean; remaining: number }> {
  if (!UPSTASH_URL || !UPSTASH_TOKEN) {
    if (!warned) {
      console.warn(
        '[rate-limit] UPSTASH_REDIS_REST_URL/TOKEN not set — rate limiting is DISABLED. Do not run pay.[domain] in production like this.',
      );
      warned = true;
    }
    return { allowed: true, remaining: limit };
  }

  const windowKey = `ratelimit:${key}:${Math.floor(Date.now() / 1000 / windowSeconds)}`;

  const res = await fetch(`${UPSTASH_URL}/pipeline`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${UPSTASH_TOKEN}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify([
      ['INCR', windowKey],
      ['EXPIRE', windowKey, String(windowSeconds)],
    ]),
    cache: 'no-store',
  });

  if (!res.ok) {
    // Fail closed would take the whole app down if Upstash hiccups —
    // fail open instead, but this is a deliberate tradeoff, not an oversight.
    console.error(`[rate-limit] Upstash request failed: ${res.status}`);
    return { allowed: true, remaining: limit };
  }

  const [incrResult] = (await res.json()) as [{ result: number }, unknown];
  const count = incrResult.result;

  return { allowed: count <= limit, remaining: Math.max(0, limit - count) };
}
