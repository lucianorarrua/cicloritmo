// ──────────────────────────────────────────────
//  CicloRitmo — Rate Limiter (KV-based, best-effort)
//  Per-IP limiting for the AI endpoint.
//  KV is eventually consistent, so this is a weak
//  layer. Primary bot protection is Turnstile.
// ──────────────────────────────────────────────

const WINDOW_S = 60;
const MAX_PER_WINDOW = 3;

export function getClientIp(request) {
  return (
    request.headers.get('CF-Connecting-IP') ||
    request.headers.get('True-Client-IP') ||
    request.headers.get('X-Real-IP') ||
    'unknown'
  );
}

export async function checkRateLimit(env, ip) {
  if (!env.RATE_LIMIT) {
    return { allowed: true };
  }

  const now = Math.floor(Date.now() / 1000);
  const bucket = Math.floor(now / WINDOW_S);
  const key = `rl:${ip}:${bucket}`;

  const raw = await env.RATE_LIMIT.get(key);
  const count = raw ? parseInt(raw, 10) : 0;

  if (count >= MAX_PER_WINDOW) {
    const retryAfter = WINDOW_S - (now % WINDOW_S);
    return { allowed: false, retryAfter };
  }

  await env.RATE_LIMIT.put(key, String(count + 1), {
    expirationTtl: WINDOW_S + 10,
  });

  return { allowed: true };
}
