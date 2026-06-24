// ──────────────────────────────────────────────
//  CicloRitmo — POST /api/generate-routine
//  Cloudflare Pages Function
//  Generates a cycling routine via LLM
//  with automatic retry on validation failure.
// ──────────────────────────────────────────────

import { buildSystemPrompt, buildUserPrompt } from '../_lib/prompt-builder.js';
import { openaiGenerate } from '../_lib/providers/openai.js';
import { checkRateLimit, getClientIp } from '../_lib/rate-limit.js';

const VALID_CATEGORIES = ['suave', 'hiit', 'fuerza', 'fondo'];
const VALID_FOCUS = ['resistencia', 'cadencia', 'mixto'];
const VALID_POSITIONS = ['sentado', 'parado'];
const INTERVAL_TYPES = ['warmup', 'work', 'recovery', 'cooldown'];
const MAX_RETRIES = 1;
const DURATION_TOLERANCE = 0.20;

function validatePreferences(p) {
  if (!p || typeof p !== 'object') {
    return 'Falta el objeto "preferences" en el body.';
  }
  if (typeof p.duration_minutes !== 'number' || p.duration_minutes < 5 || p.duration_minutes > 90) {
    return 'duration_minutes debe ser un número entre 5 y 90.';
  }
  if (!VALID_CATEGORIES.includes(p.category)) {
    return `category debe ser uno de: ${VALID_CATEGORIES.join(', ')}.`;
  }
  if (!VALID_FOCUS.includes(p.focus)) {
    return `focus debe ser uno de: ${VALID_FOCUS.join(', ')}.`;
  }
  if (!Array.isArray(p.position_preference) || p.position_preference.length === 0) {
    return 'position_preference debe ser un array no vacío.';
  }
  for (const pos of p.position_preference) {
    if (!VALID_POSITIONS.includes(pos)) {
      return `position_preference contiene un valor inválido: "${pos}". Válidos: ${VALID_POSITIONS.join(',')}.`;
    }
  }
  if (p.extra_instructions !== undefined && p.extra_instructions !== null) {
    if (typeof p.extra_instructions !== 'string') {
      return 'extra_instructions debe ser un string.';
    }
    if (p.extra_instructions.length > 500) {
      return 'extra_instructions no puede superar los 500 caracteres.';
    }
  }
  return null;
}

function validateRoutine(routine, requestedMinutes) {
  if (!routine || typeof routine !== 'object') return 'La respuesta no es un objeto JSON válido.';
  if (!routine.title || typeof routine.title !== 'string') return 'falta el campo "title".';
  if (!VALID_CATEGORIES.includes(routine.category)) return `categoría inválida: "${routine.category}".`;
  if (!routine.description || typeof routine.description !== 'string') return 'falta el campo "description".';
  if (!Array.isArray(routine.intervals) || routine.intervals.length === 0) return 'no tiene intervalos.';

  let totalDuration = 0;
  for (let i = 0; i < routine.intervals.length; i++) {
    const iv = routine.intervals[i];
    if (!iv.name || typeof iv.name !== 'string') return `el intervalo ${i + 1} no tiene "name".`;
    if (typeof iv.duration !== 'number' || iv.duration < 5) return `el intervalo ${i + 1} tiene "duration" inválido.`;
    if (typeof iv.res !== 'number' || iv.res < 1 || iv.res > 10) return `el intervalo ${i + 1} tiene "res" fuera de rango.`;
    if (typeof iv.rpm !== 'number' || iv.rpm < 30 || iv.rpm > 150) return `el intervalo ${i + 1} tiene "rpm" fuera de rango.`;
    if (!INTERVAL_TYPES.includes(iv.type)) return `el intervalo ${i + 1} tiene "type" inválido.`;
    if (!VALID_POSITIONS.includes(iv.position)) return `el intervalo ${i + 1} tiene "position" inválido.`;
    totalDuration += iv.duration;
  }

  if (requestedMinutes) {
    const targetSeconds = requestedMinutes * 60;
    const deviation = Math.abs(totalDuration - targetSeconds) / targetSeconds;
    if (deviation > DURATION_TOLERANCE) {
      const actualMinutes = Math.round(totalDuration / 60);
      return `la duración total es ${totalDuration}s ≈ ${actualMinutes} min, pero se pidieron ${targetSeconds}s = ${requestedMinutes} min. Corrige las duraciones para que la suma sea exactamente ${targetSeconds}s.`;
    }
  }

  return null;
}

function parseLLMResponse(text) {
  const trimmed = text.trim();

  const codeBlock = trimmed.match(/```(?:json)?\s*\n?([\s\S]*?)\n?```/);
  if (codeBlock) {
    return JSON.parse(codeBlock[1].trim());
  }

  const firstBrace = trimmed.indexOf('{');
  const lastBrace = trimmed.lastIndexOf('}');
  if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
    return JSON.parse(trimmed.slice(firstBrace, lastBrace + 1));
  }

  return JSON.parse(trimmed);
}

function normalizeDurations(intervals, targetSeconds) {
  if (!Array.isArray(intervals) || intervals.length === 0) return intervals;
  const currentTotal = intervals.reduce((s, iv) => s + (Number(iv?.duration) || 0), 0);
  if (currentTotal <= 0) return intervals;
  if (currentTotal === targetSeconds) return intervals;

  const factor = targetSeconds / currentTotal;
  const scaled = intervals.map(iv => Math.max(5, Math.round((Number(iv?.duration) || 0) * factor)));

  const WARMUP_MAX = Math.round(targetSeconds * 0.20);
  const COOLDOWN_MAX = Math.round(targetSeconds * 0.15);
  const coreIdx = [];
  let freed = 0;
  for (let i = 0; i < intervals.length; i++) {
    const t = intervals[i].type;
    const cap = t === 'warmup' ? WARMUP_MAX : t === 'cooldown' ? COOLDOWN_MAX : null;
    if (cap !== null && scaled[i] > cap) {
      freed += scaled[i] - cap;
      scaled[i] = cap;
    } else if (cap === null) {
      coreIdx.push(i);
    }
  }
  if (freed > 0 && coreIdx.length > 0) {
    const coreTotal = coreIdx.reduce((s, i) => s + scaled[i], 0) || 1;
    let assigned = 0;
    for (const i of coreIdx) {
      const add = Math.round(freed * (scaled[i] / coreTotal));
      scaled[i] += add;
      assigned += add;
    }
    let rem = freed - assigned;
    const order = [...coreIdx].sort((a, b) => scaled[b] - scaled[a]);
    let k = 0;
    while (rem !== 0 && k < coreIdx.length * 100) {
      scaled[order[k % order.length]] += rem > 0 ? 1 : -1;
      rem += rem > 0 ? -1 : 1;
      k++;
    }
  }

  let diff = targetSeconds - scaled.reduce((s, d) => s + d, 0);
  if (diff !== 0) {
    const order = scaled.map((_, i) => i).sort((a, b) => scaled[b] - scaled[a]);
    const step = diff > 0 ? 1 : -1;
    let k = 0;
    let guard = 0;
    while (diff !== 0 && guard < intervals.length * 1000) {
      const idx = order[k % order.length];
      if (scaled[idx] + step >= 5) {
        scaled[idx] += step;
        diff -= step;
      }
      k++;
      guard++;
    }
  }

  return intervals.map((iv, i) => ({ ...iv, duration: scaled[i] }));
}

function isAllowedOrigin(origin, host) {
  return origin && (
    origin.endsWith(host) ||
    origin.startsWith('http://localhost:')
  );
}

function corsHeaders(request) {
  const origin = request.headers.get('Origin');
  const host = new URL(request.url).hostname;
  if (!isAllowedOrigin(origin, host)) return {};
  return {
    'Access-Control-Allow-Origin': origin,
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Max-Age': '86400',
  };
}

function jsonResponse(data, status = 200, extraHeaders = {}) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json', ...extraHeaders },
  });
}

async function tryGenerate(preferences, env, maxRetries) {
  const systemPrompt = buildSystemPrompt();
  const userPrompt = buildUserPrompt(preferences);
  const messages = [
    { role: 'system', content: systemPrompt },
    { role: 'user', content: userPrompt },
  ];

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    let rawText;
    try {
      rawText = await openaiGenerate({ messages, env });
    } catch (err) {
      if (attempt === maxRetries) {
        return { error: 'Error de conexión con el servicio de IA.' };
      }
      continue;
    }

    let routine;
    try {
      routine = parseLLMResponse(rawText);
    } catch {
      if (attempt === maxRetries) {
        return { error: 'No se pudo generar una rutina válida.' };
      }
      messages.push(
        { role: 'assistant', content: rawText.slice(0, 2000) },
        { role: 'user', content: 'Tu respuesta no es un JSON válido. Responde ÚNICAMENTE con el objeto JSON de la rutina, sin markdown, sin explicaciones. Solo el JSON puro.' },
      );
      continue;
    }

    if (routine && Array.isArray(routine.intervals)) {
      routine.intervals = normalizeDurations(routine.intervals, preferences.duration_minutes * 60);
    }

    const validationError = validateRoutine(routine, preferences.duration_minutes);
    if (!validationError) {
      return { routine };
    }

    if (attempt === maxRetries) {
      return { error: 'No se pudo generar una rutina válida. Intenta con otras preferencias.' };
    }

    messages.push(
      { role: 'assistant', content: JSON.stringify(routine).slice(0, 3000) },
      { role: 'user', content: `Tu rutina fue rechazada: ${validationError} Corrige ese error y genera una nueva rutina. Responde solo con el JSON.` },
    );
  }

  return { error: 'No se pudo generar la rutina.' };
}

export async function onRequestPost(context) {
  const { request, env } = context;
  const cResp = corsHeaders(request);

  const ip = getClientIp(request);
  const rl = await checkRateLimit(env, ip);
  if (!rl.allowed) {
    return jsonResponse(
      { error: 'Demasiadas solicitudes. Límite de 3 por minuto. Reintenta en unos segundos.' },
      429,
      { ...cResp, 'Retry-After': String(rl.retryAfter || 60) },
    );
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return jsonResponse({ error: 'El body debe ser JSON válido.' }, 400, cResp);
  }

  const prefError = validatePreferences(body.preferences);
  if (prefError) {
    return jsonResponse({ error: prefError }, 400, cResp);
  }

  const result = await tryGenerate(body.preferences, env, MAX_RETRIES);
  if (result.routine) {
    return jsonResponse({ routine: result.routine }, 200, cResp);
  }
  return jsonResponse({ error: result.error || 'No se pudo generar la rutina.' }, 502, cResp);
}
export async function onRequestOptions({ request }) {
  const headers = corsHeaders(request);
  if (Object.keys(headers).length === 0) {
    return new Response(null, { status: 204 });
  }
  return new Response(null, { status: 204, headers });
}
