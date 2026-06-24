export const ROUTINES = {
  principiante: {
    title: "Iniciación al Cardio",
    category: "suave",
    description: "Pensada para calentar adecuadamente e introducir picos moderados de esfuerzo.",
    intervals: [
      { name: "Calentamiento Suave", duration: 180, res: 3, rpm: 80, type: "warmup" },
      { name: "Esfuerzo Moderado", duration: 120, res: 4, rpm: 85, type: "work" },
      { name: "Recuperación Activa", duration: 90, res: 3, rpm: 75, type: "recovery" },
      { name: "Esfuerzo Moderado", duration: 120, res: 5, rpm: 85, type: "work" },
      { name: "Recuperación Activa", duration: 90, res: 3, rpm: 75, type: "recovery" },
      { name: "Pico de Fuerza Corto", duration: 90, res: 6, rpm: 70, type: "work" },
      { name: "Enfriamiento y Relax", duration: 180, res: 2, rpm: 75, type: "cooldown" }
    ]
  },
  piramide_suave: {
    title: "Pirámide de Ritmo",
    category: "suave",
    description: "Sube progresivamente la intensidad de pedalada en forma de pirámide y desciende con control.",
    intervals: [
      { name: "Calentamiento", duration: 180, res: 2, rpm: 80, type: "warmup" },
      { name: "Peldaño 1: Ritmo Liso", duration: 180, res: 3, rpm: 85, type: "work" },
      { name: "Peldaño 2: Resistencia Media", duration: 180, res: 4, rpm: 90, type: "work" },
      { name: "Punta de Pirámide: Sprint", duration: 120, res: 5, rpm: 100, type: "work" },
      { name: "Bajada 1: Resistencia Media", duration: 180, res: 4, rpm: 90, type: "work" },
      { name: "Bajada 2: Ritmo Liso", duration: 180, res: 3, rpm: 85, type: "work" },
      { name: "Enfriamiento Relajante", duration: 180, res: 2, rpm: 75, type: "cooldown" }
    ]
  },
  tabata: {
    title: "Tabata Quemagrasa",
    category: "hiit",
    description: "HIIT puro con bloques explosivos de 20 segundos intensivos por 10 de descanso activo.",
    intervals: [
      { name: "Calentamiento Progresivo", duration: 300, res: 3, rpm: 85, type: "warmup" },
      { name: "TABATA 1/8", duration: 20, res: 6, rpm: 110, type: "work" },
      { name: "RECUPERA 1/8", duration: 10, res: 3, rpm: 70, type: "recovery" },
      { name: "TABATA 2/8", duration: 20, res: 6, rpm: 110, type: "work" },
      { name: "RECUPERA 2/8", duration: 10, res: 3, rpm: 70, type: "recovery" },
      { name: "TABATA 3/8", duration: 20, res: 6, rpm: 110, type: "work" },
      { name: "RECUPERA 3/8", duration: 10, res: 3, rpm: 70, type: "recovery" },
      { name: "TABATA 4/8", duration: 20, res: 6, rpm: 110, type: "work" },
      { name: "RECUPERA 4/8", duration: 10, res: 3, rpm: 70, type: "recovery" },
      { name: "TABATA 5/8", duration: 20, res: 6, rpm: 110, type: "work" },
      { name: "RECUPERA 5/8", duration: 10, res: 3, rpm: 70, type: "recovery" },
      { name: "TABATA 6/8", duration: 20, res: 6, rpm: 110, type: "work" },
      { name: "RECUPERA 6/8", duration: 10, res: 3, rpm: 70, type: "recovery" },
      { name: "TABATA 7/8", duration: 20, res: 6, rpm: 110, type: "work" },
      { name: "RECUPERA 7/8", duration: 10, res: 3, rpm: 70, type: "recovery" },
      { name: "TABATA 8/8", duration: 20, res: 6, rpm: 110, type: "work" },
      { name: "RECUPERA FINAL", duration: 10, res: 3, rpm: 70, type: "recovery" },
      { name: "Transición Aeróbica", duration: 240, res: 4, rpm: 80, type: "recovery" },
      { name: "Enfriamiento Profundo", duration: 300, res: 2, rpm: 75, type: "cooldown" }
    ]
  },
  tabata_double: {
    title: "Tabata Doble Explosivo",
    category: "hiit",
    description: "Dos series completas de Tabata separadas por un bloque de resistencia intermedia. Muy demandante.",
    intervals: [
      { name: "Calentamiento Activo", duration: 240, res: 3, rpm: 85, type: "warmup" },
      { name: "BLOQUE A: SPRINT 1/4", duration: 20, res: 7, rpm: 115, type: "work" },
      { name: "RECUPERACIÓN 1/4", duration: 10, res: 3, rpm: 70, type: "recovery" },
      { name: "BLOQUE A: SPRINT 2/4", duration: 20, res: 7, rpm: 115, type: "work" },
      { name: "RECUPERACIÓN 2/4", duration: 10, res: 3, rpm: 70, type: "recovery" },
      { name: "BLOQUE A: SPRINT 3/4", duration: 20, res: 7, rpm: 115, type: "work" },
      { name: "RECUPERACIÓN 3/4", duration: 10, res: 3, rpm: 70, type: "recovery" },
      { name: "BLOQUE A: SPRINT 4/4", duration: 20, res: 7, rpm: 115, type: "work" },
      { name: "RECUPERACIÓN 4/4", duration: 10, res: 3, rpm: 70, type: "recovery" },
      { name: "Valle de Recuperación", duration: 240, res: 4, rpm: 80, type: "recovery" },
      { name: "BLOQUE B: SPRINT 1/4", duration: 20, res: 8, rpm: 115, type: "work" },
      { name: "RECUPERACIÓN 1/4", duration: 10, res: 3, rpm: 70, type: "recovery" },
      { name: "BLOQUE B: SPRINT 2/4", duration: 20, res: 8, rpm: 115, type: "work" },
      { name: "RECUPERACIÓN 2/4", duration: 10, res: 3, rpm: 70, type: "recovery" },
      { name: "BLOQUE B: SPRINT 3/4", duration: 20, res: 8, rpm: 115, type: "work" },
      { name: "RECUPERACIÓN 3/4", duration: 10, res: 3, rpm: 70, type: "recovery" },
      { name: "BLOQUE B: SPRINT 4/4", duration: 20, res: 8, rpm: 115, type: "work" },
      { name: "RECUPERACIÓN FINAL", duration: 10, res: 3, rpm: 70, type: "recovery" },
      { name: "Enfriamiento Progresivo", duration: 180, res: 2, rpm: 75, type: "cooldown" }
    ]
  },
  montana: {
    title: "Subida a la Montaña",
    category: "fuerza",
    description: "Aumento gradual de la resistencia simulando colinas empinadas para tonificar piernas.",
    intervals: [
      { name: "Calentamiento y Ajuste", duration: 300, res: 3, rpm: 80, type: "warmup" },
      { name: "Colina Inicial", duration: 180, res: 5, rpm: 75, type: "work" },
      { name: "Descanso en Bajada", duration: 120, res: 3, rpm: 90, type: "recovery" },
      { name: "Cuesta Intermedia", duration: 180, res: 6, rpm: 70, type: "work" },
      { name: "Pared Final Empinada", duration: 120, res: 8, rpm: 60, type: "work" },
      { name: "Descanso Liso", duration: 180, res: 3, rpm: 85, type: "recovery" },
      { name: "Cuesta Extrema Máxima", duration: 120, res: 9, rpm: 55, type: "work" },
      { name: "Enfriamiento Completo", duration: 300, res: 2, rpm: 70, type: "cooldown" }
    ]
  },
  montana_alpinos: {
    title: "Picos Alpinos Extremos",
    category: "fuerza",
    description: "Entrenamiento de intervalos de potencia simulando tres grandes picos alpinos consecutivos.",
    intervals: [
      { name: "Calentamiento", duration: 300, res: 3, rpm: 80, type: "warmup" },
      { name: "Pico 1: Cuesta Constante", duration: 240, res: 6, rpm: 70, type: "work" },
      { name: "Descenso y Recuperación", duration: 120, res: 3, rpm: 85, type: "recovery" },
      { name: "Pico 2: Mayor Inclinación", duration: 300, res: 7, rpm: 65, type: "work" },
      { name: "Descenso y Recuperación", duration: 180, res: 4, rpm: 85, type: "recovery" },
      { name: "Pico 3: El Muro de Piedra", duration: 240, res: 9, rpm: 55, type: "work" },
      { name: "Descenso Rápido", duration: 120, res: 3, rpm: 90, type: "recovery" },
      { name: "Enfriamiento de Recuperación", duration: 300, res: 2, rpm: 75, type: "cooldown" }
    ]
  },
  aerobico: {
    title: "Fondo Aeróbico / Resistencia",
    category: "fondo",
    description: "Mantiene un esfuerzo constante, ideal para desarrollar gran capacidad cardiovascular.",
    intervals: [
      { name: "Calentamiento Lento", duration: 300, res: 3, rpm: 85, type: "warmup" },
      { name: "Ritmo Crucero Fijo", duration: 1200, res: 5, rpm: 90, type: "work" },
      { name: "Enfriamiento Paulatino", duration: 300, res: 2, rpm: 80, type: "cooldown" }
    ]
  },
  aerobico_largo: {
    title: "Fondo Quema-Grasas Zona 2",
    category: "fondo",
    description: "Sesión prolongada de baja intensidad ideal para la máxima optimización metabólica de grasas.",
    intervals: [
      { name: "Activación Metabólica", duration: 300, res: 3, rpm: 80, type: "warmup" },
      { name: "Bloque Estable Zona 2", duration: 1800, res: 4, rpm: 85, type: "work" },
      { name: "Enfriamiento", duration: 300, res: 2, rpm: 75, type: "cooldown" }
    ]
  },
  aerobico_dinamico: {
    title: "Ondas Aeróbicas Dinámicas",
    category: "fondo",
    description: "Resistencia aeróbica con cambios frecuentes de cadencia y resistencia para mantener la mente activa.",
    intervals: [
      { name: "Calentamiento Progresivo", duration: 300, res: 3, rpm: 80, type: "warmup" },
      { name: "Fase 1: Cadencia Ágil", duration: 180, res: 4, rpm: 95, type: "work" },
      { name: "Fase 2: Carga de Fuerza", duration: 180, res: 6, rpm: 75, type: "work" },
      { name: "Descanso Activo", duration: 120, res: 3, rpm: 80, type: "recovery" },
      { name: "Fase 3: Ritmo Crucero", duration: 300, res: 5, rpm: 85, type: "work" },
      { name: "Fase 4: Sprint Controlado", duration: 120, res: 4, rpm: 100, type: "work" },
      { name: "Descanso Activo", duration: 120, res: 3, rpm: 80, type: "recovery" },
      { name: "Fase 5: Colina Final", duration: 180, res: 7, rpm: 70, type: "work" },
      { name: "Enfriamiento y Relax", duration: 300, res: 2, rpm: 75, type: "cooldown" }
    ]
  }
};

export const CATEGORIES = [
  { key: 'all', label: 'Todos' },
  { key: 'suave', label: 'Suave / Iniciación' },
  { key: 'hiit', label: 'HIIT / Tabata' },
  { key: 'fuerza', label: 'Fuerza / Escalada' },
  { key: 'fondo', label: 'Fondo / Cardio' },
];

export const CATEGORY_META = {
  suave: { badge: "Suave", color: "bg-clay-brand-lavender", textColor: "text-clay-ink", badgeClass: "bg-clay-canvas/30 text-clay-ink border-clay-ink/20", maxStrength: "5/10" },
  hiit: { badge: "Muy Intenso", color: "bg-clay-brand-pink", textColor: "text-white", badgeClass: "bg-white/20 text-white border-white/20", maxStrength: "8/10" },
  fuerza: { badge: "Fuerza / Escalada", color: "bg-clay-brand-teal", textColor: "text-white", badgeClass: "bg-white/20 text-white border-white/20", maxStrength: "9/10" },
  fondo: { badge: "Fondo / Aeróbico", color: "bg-clay-brand-peach", textColor: "text-clay-ink", badgeClass: "bg-clay-canvas/40 text-clay-ink border-clay-ink/20", maxStrength: "5/10" },
};
