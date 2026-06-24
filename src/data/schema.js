// ──────────────────────────────────────────────
//  CicloRitmo — Domain Schema & Constants
//  Single source of truth for types, enums,
//  schemas, labels, and UI display mappings.
//
//  CONTRATO: Toda rutina (nueva o existente)
//  debe respetar ROUTINE_SCHEMA. Cada intervalo
//  dentro de una rutina debe cumplir INTERVAL_SCHEMA.
//  Los únicos valores válidos para type, position
//  y category están definidos en los enums de abajo.
//
//  Para crear una rutina nueva:
//    1. Definir { title, category, description, intervals[] }
//    2. Cada intervalo: { name, duration, res, rpm, type, position }
//    3. type ∈ INTERVAL_TYPES  (warmup | work | recovery | cooldown)
//    4. position ∈ POSITIONS   (sentado | parado)
//    5. category ∈ CATEGORY_KEYS (suave | hiit | fuerza | fondo)
// ──────────────────────────────────────────────

// ═══════════════════════════════════════════
//  ENUMS
// ═══════════════════════════════════════════

export const INTERVAL_TYPES = {
  WARMUP:   'warmup',
  WORK:     'work',
  RECOVERY: 'recovery',
  COOLDOWN: 'cooldown',
};

export const POSITIONS = {
  SENTADO: 'sentado',
  PARADO:  'parado',
};

export const CATEGORY_KEYS = {
  SUAVE:  'suave',
  HIIT:   'hiit',
  FUERZA: 'fuerza',
  FONDO:  'fondo',
};

export const SCREENS = {
  SELECTOR:   'selector',
  PREWORKOUT: 'preworkout',
  CREATOR:    'creator',
  WORKOUT:    'workout',
  SUMMARY:    'summary',
};

// ═══════════════════════════════════════════
//  SCHEMAS
// ═══════════════════════════════════════════

export const INTERVAL_SCHEMA = {
  name:     { type: 'string',                             required: true, description: 'Nombre descriptivo del intervalo' },
  duration: { type: 'number', min: 5,                     required: true, description: 'Duración en segundos', unit: 's' },
  res:      { type: 'number', min: 1,  max: 10,           required: true, description: 'Nivel de resistencia (1–10)' },
  rpm:      { type: 'number', min: 30, max: 150,          required: true, description: 'Cadencia objetivo', unit: 'RPM' },
  type:     { type: 'enum',   values: Object.values(INTERVAL_TYPES),  required: true, description: 'Tipo de fase' },
  position: { type: 'enum',   values: Object.values(POSITIONS),       required: true, description: 'Posición del ciclista' },
};

export const ROUTINE_SCHEMA = {
  title:       { type: 'string',                            required: true, description: 'Nombre de la rutina' },
  category:    { type: 'enum',   values: Object.values(CATEGORY_KEYS), required: true, description: 'Categoría de intensidad' },
  description: { type: 'string',                            required: true, description: 'Descripción breve' },
  intervals:   { type: 'array',  of: INTERVAL_SCHEMA,       required: true, description: 'Secuencia de intervalos' },
};

// ═══════════════════════════════════════════
//  LABELS (Spanish human‑readable text)
// ═══════════════════════════════════════════

export const TYPE_LABELS = {
  warmup:   'Calentamiento',
  work:     'Trabajo',
  recovery: 'Recuperación',
  cooldown: 'Enfriamiento',
};

export const POSITION_LABELS = {
  sentado: 'Sentado',
  parado:  'De Pie',
};

// ═══════════════════════════════════════════
//  CATEGORIES (ordered array for tabs)
// ═══════════════════════════════════════════

export const CATEGORIES = [
  { key: 'all',    label: 'Todos',                 color: 'bg-clay-ink',                  textColor: 'text-clay-on-primary' },
  { key: 'suave',  label: 'Suave / Iniciación',    color: 'bg-clay-brand-lavender',       textColor: 'text-clay-ink' },
  { key: 'hiit',   label: 'HIIT / Tabata',         color: 'bg-clay-brand-pink',           textColor: 'text-white' },
  { key: 'fuerza', label: 'Fuerza / Escalada',     color: 'bg-clay-brand-teal',           textColor: 'text-white' },
  { key: 'fondo',  label: 'Fondo / Cardio',        color: 'bg-clay-brand-peach',          textColor: 'text-clay-ink' },
];

export const CATEGORY_META = {
  suave:  { badge: 'Suave',            color: 'bg-clay-brand-lavender', textColor: 'text-clay-ink',  badgeClass: 'bg-clay-canvas/30 text-clay-ink border-clay-ink/20',  maxStrength: '5/10' },
  hiit:   { badge: 'Muy Intenso',      color: 'bg-clay-brand-pink',     textColor: 'text-white',     badgeClass: 'bg-white/20 text-white border-white/20',              maxStrength: '8/10' },
  fuerza: { badge: 'Fuerza / Escalada', color: 'bg-clay-brand-teal',    textColor: 'text-white',     badgeClass: 'bg-white/20 text-white border-white/20',              maxStrength: '9/10' },
  fondo:  { badge: 'Fondo / Aeróbico',  color: 'bg-clay-brand-peach',   textColor: 'text-clay-ink',  badgeClass: 'bg-clay-canvas/40 text-clay-ink border-clay-ink/20', maxStrength: '5/10' },
};

// ═══════════════════════════════════════════
//  UI BADGES (Tailwind CSS classes)
// ═══════════════════════════════════════════

export const TYPE_BADGES = {
  warmup:   'bg-clay-brand-lavender/40 text-clay-ink',
  work:     'bg-clay-brand-pink/20 text-clay-brand-pink',
  recovery: 'bg-green-100 text-green-700',
  cooldown: 'bg-clay-brand-lavender/40 text-clay-ink',
};

export const TYPE_ACCENT = {
  warmup:   'border-l-clay-brand-lavender',
  work:     'border-l-clay-brand-pink',
  recovery: 'border-l-clay-success',
  cooldown: 'border-l-clay-brand-lavender',
};

export const POSITION_BADGES = {
  sentado: 'bg-blue-50 text-blue-600',
  parado:  'bg-amber-50 text-amber-700',
};

// ═══════════════════════════════════════════
//  PHASE & POSITION DISPLAY (Workout screen)
// ═══════════════════════════════════════════

export const PHASE_DISPLAY = {
  warmup:   { color: '#a4d4c5', bg: 'bg-clay-brand-mint/30',     text: 'Calentamiento', textClass: 'text-clay-brand-teal',   badge: 'bg-clay-brand-teal text-white' },
  work:     { color: '#EF4444', bg: 'bg-red-50',                 text: 'Trabajo',       textClass: 'text-clay-error',         badge: 'bg-clay-error text-white' },
  recovery: { color: '#22c55e', bg: 'bg-green-50',               text: 'Recuperación',  textClass: 'text-clay-success',        badge: 'bg-clay-success text-white' },
  cooldown: { color: '#b8a4ed', bg: 'bg-clay-brand-lavender/20', text: 'Enfriamiento',  textClass: 'text-clay-brand-lavender', badge: 'bg-clay-brand-lavender text-clay-ink' },
};

export const POSITION_DISPLAY = {
  sentado: { text: 'Sentado', badge: 'bg-blue-50 text-blue-600 border border-blue-200' },
  parado:  { text: 'De Pie',  badge: 'bg-amber-50 text-amber-700 border border-amber-200' },
};

// ═══════════════════════════════════════════
//  EFFORT LEVELS
// ═══════════════════════════════════════════

export const EFFORT_FORMULA = {
  rpmWeight: 0.3,
  resWeight: 1.5,
};

export const EFFORT_LEVELS = [
  { maxScore: 5,       label: 'Suave',   color: 'text-clay-brand-mint' },
  { maxScore: 10,      label: 'Moderado', color: 'text-clay-brand-ochre' },
  { maxScore: 15,      label: 'Alto',     color: 'text-clay-brand-peach' },
  { maxScore: 20,      label: 'Intenso',  color: 'text-clay-brand-coral' },
  { maxScore: Infinity, label: 'Máximo',  color: 'text-clay-error' },
];

export function getEffortLevel(rpm, res) {
  const score = (rpm || 0) * EFFORT_FORMULA.rpmWeight + (res || 0) * EFFORT_FORMULA.resWeight;
  return EFFORT_LEVELS.find(l => score < l.maxScore) || EFFORT_LEVELS[EFFORT_LEVELS.length - 1];
}

// ═══════════════════════════════════════════
//  PHASE LOOKUP HELPER
// ═══════════════════════════════════════════

export function getPhaseInfo(type) {
  return PHASE_DISPLAY[type] || {
    color: '#0a0a0a',
    bg: 'bg-clay-surface-soft',
    text: type,
    textClass: 'text-clay-ink',
    badge: 'bg-clay-ink text-white',
  };
}
