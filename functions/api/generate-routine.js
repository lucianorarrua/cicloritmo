// ──────────────────────────────────────────────
//  CicloRitmo — POST /api/generate-routine
//  Cloudflare Pages Function
//  Generates a cycling routine via LLM.
// ──────────────────────────────────────────────

import { buildSystemPrompt, buildUserPrompt } from '../_lib/prompt-builder.js';
import { openaiGenerate } from '../_lib/providers/openai.js';

const VALID_CATEGORIES = ['suave', 'hiit', 'fuerza', 'fondo'];
const VALID_FOCUS = ['resistencia', 'cadencia', 'mixto'];
const VALID_POSITIONS = ['sentado', 'parado'];
const INTERVAL_TYPES = ['warmup', 'work', 'recovery', 'cooldown'];

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
  return null;
}

function validateRoutine(routine, requestedMinutes) {
  if (!routine || typeof routine !== 'object') return 'La respuesta no contiene un objeto JSON válido.';
  if (!routine.title || typeof routine.title !== 'string') return 'Falta el campo "title".';
  if (!VALID_CATEGORIES.includes(routine.category)) return `Categoría inválida: "${routine.category}".`;
  if (!routine.description || typeof routine.description !== 'string') return 'Falta el campo "description".';
  if (!Array.isArray(routine.intervals) || routine.intervals.length === 0) return 'Falta el array "intervals" o está vacío.';

  let totalDuration = 0;
  for (let i = 0; i < routine.intervals.length; i++) {
    const iv = routine.intervals[i];
    if (!iv.name || typeof iv.name !== 'string') return `Intervalo ${i + 1}: falta "name".`;
    if (typeof iv.duration !== 'number' || iv.duration < 5) return `Intervalo ${i + 1}: "duration" inválido (mín 5s).`;
    if (typeof iv.res !== 'number' || iv.res < 1 || iv.res > 10) return `Intervalo ${i + 1}: "res" fuera de rango (1-10).`;
    if (typeof iv.rpm !== 'number' || iv.rpm < 30 || iv.rpm > 150) return `Intervalo ${i + 1}: "rpm" fuera de rango (30-150).`;
    if (!INTERVAL_TYPES.includes(iv.type)) return `Intervalo ${i + 1}: "type" inválido: "${iv.type}".`;
    if (!VALID_POSITIONS.includes(iv.position)) return `Intervalo ${i + 1}: "position" inválido: "${iv.position}".`;
    totalDuration += iv.duration;
  }

  if (requestedMinutes) {
    const targetSeconds = requestedMinutes * 60;
    const deviation = Math.abs(totalDuration - targetSeconds) / targetSeconds;
    if (deviation > 0.20) {
      const actualMinutes = Math.round(totalDuration / 60);
      return `La duración total de la rutina (${totalDuration}s ≈ ${actualMinutes} min) no coincide con la solicitada (${targetSeconds}s = ${requestedMinutes} min). Desviación: ${Math.round(deviation * 100)}%.`;
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

export async function onRequestPost(context) {
  const { request, env } = context;

  const cResp = corsHeaders(request);

  // Parse body
  let body;
  try {
    body = await request.json();
  } catch {
    return jsonResponse({ error: 'El body debe ser JSON válido.' }, 400, cResp);
  }

  // Validate preferences
  const prefError = validatePreferences(body.preferences);
  if (prefError) {
    return jsonResponse({ error: prefError }, 400, cResp);
  }

  // Build prompts
  const systemPrompt = buildSystemPrompt();
  const userPrompt = buildUserPrompt(body.preferences);

  // Call LLM
  let rawText;
  try {
    const provider = env.AI_PROVIDER || 'openai';
    if (provider !== 'openai') {
      return jsonResponse({ error: `Proveedor IA no soportado: ${provider}. Solo "openai" está disponible.` }, 500, cResp);
    }
    rawText = await openaiGenerate({ systemPrompt, userPrompt, env });
  } catch (err) {
    return jsonResponse({ error: `Error al generar la rutina: ${err.message}` }, 502, cResp);
  }

  // Parse LLM response
  let routine;
  try {
    routine = parseLLMResponse(rawText);
  } catch (err) {
    return jsonResponse({ error: `El modelo no devolvió JSON válido. Intenta de nuevo. Detalle: ${err.message}` }, 502, cResp);
  }

  // Validate routine
  const routineError = validateRoutine(routine, body.preferences.duration_minutes);
  if (routineError) {
    return jsonResponse({ error: `La rutina generada no cumple el esquema: ${routineError}` }, 502, cResp);
  }

  return jsonResponse({ routine }, 200, cResp);
}

export async function onRequestOptions({ request }) {
  const headers = corsHeaders(request);
  if (Object.keys(headers).length === 0) {
    return new Response(null, { status: 204 });
  }
  return new Response(null, { status: 204, headers });
}
