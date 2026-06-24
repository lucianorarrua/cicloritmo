export const ROUTINES = {
  principiante: {
    title: "Iniciación al Cardio",
    category: "suave",
    description: "Pensada para calentar adecuadamente e introducir picos moderados de esfuerzo.",
    intervals: [
      { name: "Calentamiento Suave", duration: 180, res: 3, rpm: 80, type: "warmup", position: "sentado" },
      { name: "Esfuerzo Moderado", duration: 120, res: 4, rpm: 85, type: "work", position: "sentado" },
      { name: "Recuperación Activa", duration: 90, res: 3, rpm: 75, type: "recovery", position: "sentado" },
      { name: "Esfuerzo Moderado", duration: 120, res: 5, rpm: 85, type: "work", position: "sentado" },
      { name: "Recuperación Activa", duration: 90, res: 3, rpm: 75, type: "recovery", position: "sentado" },
      { name: "Pico de Fuerza Corto", duration: 90, res: 6, rpm: 70, type: "work", position: "parado" },
      { name: "Enfriamiento y Relax", duration: 180, res: 2, rpm: 75, type: "cooldown", position: "sentado" }
    ]
  },
  piramide_suave: {
    title: "Pirámide de Ritmo",
    category: "suave",
    description: "Sube progresivamente la intensidad de pedalada en forma de pirámide y desciende con control.",
    intervals: [
      { name: "Calentamiento", duration: 180, res: 2, rpm: 80, type: "warmup", position: "sentado" },
      { name: "Peldaño 1: Ritmo Liso", duration: 180, res: 3, rpm: 85, type: "work", position: "sentado" },
      { name: "Peldaño 2: Resistencia Media", duration: 180, res: 4, rpm: 90, type: "work", position: "sentado" },
      { name: "Punta de Pirámide: Sprint", duration: 120, res: 5, rpm: 100, type: "work", position: "parado" },
      { name: "Bajada 1: Resistencia Media", duration: 180, res: 4, rpm: 90, type: "work", position: "sentado" },
      { name: "Bajada 2: Ritmo Liso", duration: 180, res: 3, rpm: 85, type: "work", position: "sentado" },
      { name: "Enfriamiento Relajante", duration: 180, res: 2, rpm: 75, type: "cooldown", position: "sentado" }
    ]
  },
  tabata: {
    title: "Tabata Quemagrasa",
    category: "hiit",
    description: "HIIT puro con bloques explosivos de 20 segundos intensivos por 10 de descanso activo.",
    intervals: [
      { name: "Calentamiento Progresivo", duration: 300, res: 3, rpm: 85, type: "warmup", position: "sentado" },
      { name: "TABATA 1/8", duration: 20, res: 6, rpm: 110, type: "work", position: "parado" },
      { name: "RECUPERA 1/8", duration: 10, res: 3, rpm: 70, type: "recovery", position: "sentado" },
      { name: "TABATA 2/8", duration: 20, res: 6, rpm: 110, type: "work", position: "parado" },
      { name: "RECUPERA 2/8", duration: 10, res: 3, rpm: 70, type: "recovery", position: "sentado" },
      { name: "TABATA 3/8", duration: 20, res: 6, rpm: 110, type: "work", position: "parado" },
      { name: "RECUPERA 3/8", duration: 10, res: 3, rpm: 70, type: "recovery", position: "sentado" },
      { name: "TABATA 4/8", duration: 20, res: 6, rpm: 110, type: "work", position: "parado" },
      { name: "RECUPERA 4/8", duration: 10, res: 3, rpm: 70, type: "recovery", position: "sentado" },
      { name: "TABATA 5/8", duration: 20, res: 6, rpm: 110, type: "work", position: "parado" },
      { name: "RECUPERA 5/8", duration: 10, res: 3, rpm: 70, type: "recovery", position: "sentado" },
      { name: "TABATA 6/8", duration: 20, res: 6, rpm: 110, type: "work", position: "parado" },
      { name: "RECUPERA 6/8", duration: 10, res: 3, rpm: 70, type: "recovery", position: "sentado" },
      { name: "TABATA 7/8", duration: 20, res: 6, rpm: 110, type: "work", position: "parado" },
      { name: "RECUPERA 7/8", duration: 10, res: 3, rpm: 70, type: "recovery", position: "sentado" },
      { name: "TABATA 8/8", duration: 20, res: 6, rpm: 110, type: "work", position: "parado" },
      { name: "RECUPERA FINAL", duration: 10, res: 3, rpm: 70, type: "recovery", position: "sentado" },
      { name: "Transición Aeróbica", duration: 240, res: 4, rpm: 80, type: "recovery", position: "sentado" },
      { name: "Enfriamiento Profundo", duration: 300, res: 2, rpm: 75, type: "cooldown", position: "sentado" }
    ]
  },
  tabata_double: {
    title: "Tabata Doble Explosivo",
    category: "hiit",
    description: "Dos series completas de Tabata separadas por un bloque de resistencia intermedia. Muy demandante.",
    intervals: [
      { name: "Calentamiento Activo", duration: 240, res: 3, rpm: 85, type: "warmup", position: "sentado" },
      { name: "BLOQUE A: SPRINT 1/4", duration: 20, res: 7, rpm: 115, type: "work", position: "parado" },
      { name: "RECUPERACIÓN 1/4", duration: 10, res: 3, rpm: 70, type: "recovery", position: "sentado" },
      { name: "BLOQUE A: SPRINT 2/4", duration: 20, res: 7, rpm: 115, type: "work", position: "parado" },
      { name: "RECUPERACIÓN 2/4", duration: 10, res: 3, rpm: 70, type: "recovery", position: "sentado" },
      { name: "BLOQUE A: SPRINT 3/4", duration: 20, res: 7, rpm: 115, type: "work", position: "parado" },
      { name: "RECUPERACIÓN 3/4", duration: 10, res: 3, rpm: 70, type: "recovery", position: "sentado" },
      { name: "BLOQUE A: SPRINT 4/4", duration: 20, res: 7, rpm: 115, type: "work", position: "parado" },
      { name: "RECUPERACIÓN 4/4", duration: 10, res: 3, rpm: 70, type: "recovery", position: "sentado" },
      { name: "Valle de Recuperación", duration: 240, res: 4, rpm: 80, type: "recovery", position: "sentado" },
      { name: "BLOQUE B: SPRINT 1/4", duration: 20, res: 8, rpm: 115, type: "work", position: "parado" },
      { name: "RECUPERACIÓN 1/4", duration: 10, res: 3, rpm: 70, type: "recovery", position: "sentado" },
      { name: "BLOQUE B: SPRINT 2/4", duration: 20, res: 8, rpm: 115, type: "work", position: "parado" },
      { name: "RECUPERACIÓN 2/4", duration: 10, res: 3, rpm: 70, type: "recovery", position: "sentado" },
      { name: "BLOQUE B: SPRINT 3/4", duration: 20, res: 8, rpm: 115, type: "work", position: "parado" },
      { name: "RECUPERACIÓN 3/4", duration: 10, res: 3, rpm: 70, type: "recovery", position: "sentado" },
      { name: "BLOQUE B: SPRINT 4/4", duration: 20, res: 8, rpm: 115, type: "work", position: "parado" },
      { name: "RECUPERACIÓN FINAL", duration: 10, res: 3, rpm: 70, type: "recovery", position: "sentado" },
      { name: "Enfriamiento Progresivo", duration: 180, res: 2, rpm: 75, type: "cooldown", position: "sentado" }
    ]
  },
  montana: {
    title: "Subida a la Montaña",
    category: "fuerza",
    description: "Aumento gradual de la resistencia simulando colinas empinadas para tonificar piernas.",
    intervals: [
      { name: "Calentamiento y Ajuste", duration: 300, res: 3, rpm: 80, type: "warmup", position: "sentado" },
      { name: "Colina Inicial", duration: 180, res: 5, rpm: 75, type: "work", position: "parado" },
      { name: "Descanso en Bajada", duration: 120, res: 3, rpm: 90, type: "recovery", position: "sentado" },
      { name: "Cuesta Intermedia", duration: 180, res: 6, rpm: 70, type: "work", position: "parado" },
      { name: "Pared Final Empinada", duration: 120, res: 8, rpm: 60, type: "work", position: "parado" },
      { name: "Descanso Liso", duration: 180, res: 3, rpm: 85, type: "recovery", position: "sentado" },
      { name: "Cuesta Extrema Máxima", duration: 120, res: 9, rpm: 55, type: "work", position: "parado" },
      { name: "Enfriamiento Completo", duration: 300, res: 2, rpm: 70, type: "cooldown", position: "sentado" }
    ]
  },
  montana_alpinos: {
    title: "Picos Alpinos Extremos",
    category: "fuerza",
    description: "Entrenamiento de intervalos de potencia simulando tres grandes picos alpinos consecutivos.",
    intervals: [
      { name: "Calentamiento", duration: 300, res: 3, rpm: 80, type: "warmup", position: "sentado" },
      { name: "Pico 1: Cuesta Constante", duration: 240, res: 6, rpm: 70, type: "work", position: "parado" },
      { name: "Descenso y Recuperación", duration: 120, res: 3, rpm: 85, type: "recovery", position: "sentado" },
      { name: "Pico 2: Mayor Inclinación", duration: 300, res: 7, rpm: 65, type: "work", position: "parado" },
      { name: "Descenso y Recuperación", duration: 180, res: 4, rpm: 85, type: "recovery", position: "sentado" },
      { name: "Pico 3: El Muro de Piedra", duration: 240, res: 9, rpm: 55, type: "work", position: "parado" },
      { name: "Descenso Rápido", duration: 120, res: 3, rpm: 90, type: "recovery", position: "sentado" },
      { name: "Enfriamiento de Recuperación", duration: 300, res: 2, rpm: 75, type: "cooldown", position: "sentado" }
    ]
  },
  aerobico: {
    title: "Fondo Aeróbico / Resistencia",
    category: "fondo",
    description: "Mantiene un esfuerzo constante, ideal para desarrollar gran capacidad cardiovascular.",
    intervals: [
      { name: "Calentamiento Lento", duration: 300, res: 3, rpm: 85, type: "warmup", position: "sentado" },
      { name: "Ritmo Crucero Fijo", duration: 1200, res: 5, rpm: 90, type: "work", position: "sentado" },
      { name: "Enfriamiento Paulatino", duration: 300, res: 2, rpm: 80, type: "cooldown", position: "sentado" }
    ]
  },
  aerobico_largo: {
    title: "Fondo Quema-Grasas Zona 2",
    category: "fondo",
    description: "Sesión prolongada de baja intensidad ideal para la máxima optimización metabólica de grasas.",
    intervals: [
      { name: "Activación Metabólica", duration: 300, res: 3, rpm: 80, type: "warmup", position: "sentado" },
      { name: "Bloque Estable Zona 2", duration: 1800, res: 4, rpm: 85, type: "work", position: "sentado" },
      { name: "Enfriamiento", duration: 300, res: 2, rpm: 75, type: "cooldown", position: "sentado" }
    ]
  },
  aerobico_dinamico: {
    title: "Ondas Aeróbicas Dinámicas",
    category: "fondo",
    description: "Resistencia aeróbica con cambios frecuentes de cadencia y resistencia para mantener la mente activa.",
    intervals: [
      { name: "Calentamiento Progresivo", duration: 300, res: 3, rpm: 80, type: "warmup", position: "sentado" },
      { name: "Fase 1: Cadencia Ágil", duration: 180, res: 4, rpm: 95, type: "work", position: "sentado" },
      { name: "Fase 2: Carga de Fuerza", duration: 180, res: 6, rpm: 75, type: "work", position: "parado" },
      { name: "Descanso Activo", duration: 120, res: 3, rpm: 80, type: "recovery", position: "sentado" },
      { name: "Fase 3: Ritmo Crucero", duration: 300, res: 5, rpm: 85, type: "work", position: "sentado" },
      { name: "Fase 4: Sprint Controlado", duration: 120, res: 4, rpm: 100, type: "work", position: "parado" },
      { name: "Descanso Activo", duration: 120, res: 3, rpm: 80, type: "recovery", position: "sentado" },
      { name: "Fase 5: Colina Final", duration: 180, res: 7, rpm: 70, type: "work", position: "parado" },
      { name: "Enfriamiento y Relax", duration: 300, res: 2, rpm: 75, type: "cooldown", position: "sentado" }
    ]
  },
  aerobico_mixto: {
    title: "Ondas Mixtas de Resistencia",
    category: "fondo",
    description: "Resistencia aeróbica combinando bloques sentado y de pie para un entrenamiento completo y variado.",
    intervals: [
      { name: "Calentamiento Progresivo", duration: 300, res: 3, rpm: 80, type: "warmup", position: "sentado" },
      { name: "Bloque Sentado Zona 2", duration: 240, res: 4, rpm: 85, type: "work", position: "sentado" },
      { name: "Transición de Pie Suave", duration: 180, res: 5, rpm: 75, type: "work", position: "parado" },
      { name: "Recuperación Sentado", duration: 120, res: 3, rpm: 80, type: "recovery", position: "sentado" },
      { name: "Bloque de Pie Zona 2-3", duration: 300, res: 5, rpm: 85, type: "work", position: "parado" },
      { name: "Descanso Activo", duration: 120, res: 3, rpm: 80, type: "recovery", position: "sentado" },
      { name: "Escalada de Pie", duration: 180, res: 7, rpm: 65, type: "work", position: "parado" },
      { name: "Ritmo Crucero Sentado", duration: 300, res: 4, rpm: 85, type: "work", position: "sentado" },
      { name: "Enfriamiento", duration: 300, res: 2, rpm: 75, type: "cooldown", position: "sentado" }
    ]
  }
};

