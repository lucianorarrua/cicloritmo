// ──────────────────────────────────────────────
//  CicloRitmo — API Contract (Generador IA)
//  Single source of truth for the AI routine
//  generator endpoint. Any backend implementing
//  this contract will work with the frontend.
//
//  Endpoint: POST {VITE_ROUTINE_GENERATOR_URL}
// ──────────────────────────────────────────────

import { INTERVAL_TYPES, POSITIONS, CATEGORY_KEYS } from './schema.js';

// ═══════════════════════════════════════════
//  REQUEST SCHEMA
// ═══════════════════════════════════════════

export const PREFERENCE_SHAPE = {
  duration_minutes:    { type: 'number', min: 5, max: 90, required: true,  description: 'Duración total deseada en minutos' },
  category:            { type: 'enum',   values: Object.values(CATEGORY_KEYS), required: true,  description: 'Categoría de intensidad' },
  focus:               { type: 'enum',   values: ['resistencia', 'cadencia', 'mixto'], required: true, description: 'Enfoque del entrenamiento' },
  position_preference: { type: 'array',  of: Object.values(POSITIONS), required: true, description: 'Posiciones deseadas (múltiple)' },
  extra_instructions:  { type: 'string', maxChars: 500, required: false, description: 'Instrucciones adicionales en texto libre' },
};

export const FOCUS_OPTIONS = [
  { key: 'resistencia', label: 'Resistencia' },
  { key: 'cadencia',    label: 'Cadencia' },
  { key: 'mixto',       label: 'Mixto' },
];

// ═══════════════════════════════════════════
//  RESPONSE SCHEMA
// ═══════════════════════════════════════════

export const INTERVAL_RESPONSE_SHAPE = {
  name:     { type: 'string',                             required: true },
  duration: { type: 'number', min: 5,                     required: true, unit: 's' },
  res:      { type: 'number', min: 1,  max: 10,           required: true },
  rpm:      { type: 'number', min: 30, max: 150,          required: true },
  type:     { type: 'enum',   values: Object.values(INTERVAL_TYPES),  required: true },
  position: { type: 'enum',   values: Object.values(POSITIONS),       required: true },
};

export const ROUTINE_RESPONSE_SHAPE = {
  title:       { type: 'string', required: true },
  category:    { type: 'enum',   values: Object.values(CATEGORY_KEYS), required: true },
  description: { type: 'string', required: true },
  intervals:   { type: 'array',  of: INTERVAL_RESPONSE_SHAPE, required: true, minLength: 1 },
};

// ═══════════════════════════════════════════
//  VALIDATION
// ═══════════════════════════════════════════

export function validateRoutine(routine) {
  if (!routine || typeof routine !== 'object') {
    return { valid: false, error: 'La rutina debe ser un objeto' };
  }
  if (!routine.title || typeof routine.title !== 'string') {
    return { valid: false, error: 'Falta el título de la rutina' };
  }
  if (!Object.values(CATEGORY_KEYS).includes(routine.category)) {
    return { valid: false, error: `Categoría inválida: ${routine.category}. Válidas: ${Object.values(CATEGORY_KEYS).join(', ')}` };
  }
  if (!routine.description || typeof routine.description !== 'string') {
    return { valid: false, error: 'Falta la descripción de la rutina' };
  }
  if (!Array.isArray(routine.intervals) || routine.intervals.length === 0) {
    return { valid: false, error: 'La rutina debe tener al menos un intervalo' };
  }

  const validTypes = Object.values(INTERVAL_TYPES);
  const validPositions = Object.values(POSITIONS);

  for (let i = 0; i < routine.intervals.length; i++) {
    const iv = routine.intervals[i];
    if (!iv.name || typeof iv.name !== 'string') {
      return { valid: false, error: `Intervalo ${i + 1}: falta el nombre` };
    }
    if (typeof iv.duration !== 'number' || iv.duration < 5) {
      return { valid: false, error: `Intervalo ${i + 1}: duración inválida (mínimo 5s)` };
    }
    if (typeof iv.res !== 'number' || iv.res < 1 || iv.res > 10) {
      return { valid: false, error: `Intervalo ${i + 1}: resistencia fuera de rango (1–10)` };
    }
    if (typeof iv.rpm !== 'number' || iv.rpm < 30 || iv.rpm > 150) {
      return { valid: false, error: `Intervalo ${i + 1}: RPM fuera de rango (30–150)` };
    }
    if (!validTypes.includes(iv.type)) {
      return { valid: false, error: `Intervalo ${i + 1}: tipo inválido "${iv.type}"` };
    }
    if (!validPositions.includes(iv.position)) {
      return { valid: false, error: `Intervalo ${i + 1}: posición inválida "${iv.position}"` };
    }
  }

  return { valid: true };
}

// ═══════════════════════════════════════════
//  SCHEMA CONTEXT (for provider backends)
// ═══════════════════════════════════════════

export const SCHEMA_CONTEXT = {
  interval_types: Object.values(INTERVAL_TYPES),
  positions: Object.values(POSITIONS),
  categories: Object.values(CATEGORY_KEYS),
  resistance_range: { min: 1, max: 10 },
  rpm_range: { min: 30, max: 150 },
  min_interval_duration_s: 5,
  max_total_duration_m: 90,
};
