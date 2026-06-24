// ──────────────────────────────────────────────
//  CicloRitmo — AI Routine Generator Client
//  Calls the configured endpoint to generate
//  a workout routine from user preferences.
// ──────────────────────────────────────────────

import { validateRoutine } from '../data/contract.js';

const AI_ENDPOINT = import.meta.env.VITE_ROUTINE_GENERATOR_URL || '';
const TIMEOUT_MS = 90000;

export function isAiEnabled() {
  return !!AI_ENDPOINT;
}

export async function generateRoutine(preferences) {
  if (!isAiEnabled()) {
    return { ok: false, error: 'El generador de rutinas IA no está configurado.' };
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), TIMEOUT_MS);

  try {
    const res = await fetch(AI_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ preferences }),
      signal: controller.signal,
    });

    const data = await res.json();

    if (!res.ok) {
      return { ok: false, error: data.error || `Error del servidor (${res.status})` };
    }

    const validation = validateRoutine(data.routine);
    if (!validation.valid) {
      return { ok: false, error: `La rutina generada es inválida: ${validation.error}` };
    }

    return { ok: true, routine: data.routine };
  } catch (err) {
    if (err.name === 'AbortError') {
      return { ok: false, error: 'El servidor tardó demasiado en responder. Intenta de nuevo.' };
    }
    return { ok: false, error: 'No se pudo conectar con el generador de rutinas. Verifica tu conexión.' };
  } finally {
    clearTimeout(timeout);
  }
}
