// ──────────────────────────────────────────────
//  CicloRitmo — Rate Limiter (KV-based)
//  Per-IP limiting for the AI endpoint to
//  prevent API key cost abuse.
// ──────────────────────────────────────────────

const MINUTE_WINDOW_S = 60;
const HOUR_WINDOW_S = 3600;
const MAX_PER_MINUTE = 5;
const MAX_PER_HOUR = 20;

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
  const minuteBucket = Math.floor(now / MINUTE_WINDOW_S);
  const hourBucket = Math.floor(now / HOUR_WINDOW_S);

  const minuteKey = `rl:m:${ip}:${minuteBucket}`;
  const hourKey = `rl:h:${ip}:${hourBucket}`;

  const [minuteRaw, hourRaw] = await Promise.all([
    env.RATE_LIMIT.get(minuteKey),
    env.RATE_LIMIT.get(hourKey),
  ]);

  const minuteCount = minuteRaw ? parseInt(minuteRaw, 10) : 0;
  const hourCount = hourRaw ? parseInt(hourRaw, 10) : 0;

  if (minuteCount >= MAX_PER_MINUTE) {
    const retryAfter = MINUTE_WINDOW_S - (now % MINUTE_WINDOW_S);
    return { allowed: false, retryAfter, limit: 'minute', max: MAX_PER_MINUTE };
  }
  if (hourCount >= MAX_PER_HOUR) {
    const retryAfter = HOUR_WINDOW_S - (now % HOUR_WINDOW_S);
    return { allowed: false, retryAfter, limit: 'hour', max: MAX_PER_HOUR };
  }

  await Promise.all([
    env.RATE_LIMIT.put(minuteKey, String(minuteCount + 1), {
      expirationTtl: MINUTE_WINDOW_S + 10,
    }),
    env.RATE_LIMIT.put(hourKey, String(hourCount + 1), {
      expirationTtl: HOUR_WINDOW_S + 10,
    }),
  ]);

  return { allowed: true };
}
