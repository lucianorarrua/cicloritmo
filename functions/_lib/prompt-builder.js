// ──────────────────────────────────────────────
//  CicloRitmo — Prompt Builder
//  Constructs the system prompt for the LLM
//  using the domain schema and rules.
// ──────────────────────────────────────────────

const INTERVAL_TYPES = {
  WARMUP: 'warmup',
  WORK: 'work',
  RECOVERY: 'recovery',
  COOLDOWN: 'cooldown',
};

const POSITIONS = ['sentado', 'parado'];

const CATEGORIES = {
  suave: { label: 'Suave / Iniciación', maxRes: 5, maxRpm: 100 },
  hiit: { label: 'HIIT / Tabata', maxRes: 8, maxRpm: 115 },
  fuerza: { label: 'Fuerza / Escalada', maxRes: 10, maxRpm: 90 },
  fondo: { label: 'Fondo / Aeróbico', maxRes: 5, maxRpm: 100 },
};

const CATEGORY_GUIDELINES = {
  suave: 'Entre 2 y 5 intervalos de trabajo. Ritmo tranquilo y controlado. Resistencias bajas (1-5). RPM moderadas (75-100). Ideal para principiantes o recuperación activa.',
  hiit: 'Entre 6 y 16 intervalos de trabajo. Bloques muy cortos (15-30s) de alta intensidad con recuperaciones breves (10-15s). Resistencias medias-altas (5-8). RPM muy altas (100-115). Alta demanda cardiovascular.',
  fuerza: 'Entre 3 y 6 intervalos de trabajo. Bloques largos (90-300s) con resistencia alta (6-10). RPM bajas (55-75). Simula subidas de montaña. Mucho trabajo de pie.',
  fondo: 'Entre 1 y 4 intervalos de trabajo. Bloques muy largos (180-1800s) con resistencia media (4-5). RPM medias-altas (85-95). Trabajo aeróbico constante, mayormente sentado.',
};

const FOCUS_GUIDELINES = {
  resistencia: 'Prioriza bloques con resistencia alta (res 6-10) y RPM moderadas-bajas (55-80). Usa más bloques de fuerza y trabajo de pie.',
  cadencia: 'Prioriza bloques con resistencia moderada (res 3-5) y RPM altas (95-110). Mantén al ciclista sentado en momentos de alta cadencia.',
  mixto: 'Combina bloques de resistencia (res 6-8, RPM bajas) con bloques de cadencia (res 3-4, RPM altas). Alterna entre sentado y de pie.',
};

const EXAMPLE_ROUTINE = {
  title: 'HIIT Express 25 min (1500s exactos)',
  category: 'hiit',
  description: 'Entrenamiento HIIT corto e intenso. La suma de todas las duraciones es exactamente 1500 segundos = 25 minutos.',
  intervals: [
    { name: 'Calentamiento Progresivo', duration: 300, res: 3, rpm: 85, type: 'warmup', position: 'sentado' },
    { name: 'Sprint 1/5', duration: 20, res: 7, rpm: 110, type: 'work', position: 'parado' },
    { name: 'Recupera 1/5', duration: 10, res: 3, rpm: 70, type: 'recovery', position: 'sentado' },
    { name: 'Sprint 2/5', duration: 20, res: 7, rpm: 110, type: 'work', position: 'parado' },
    { name: 'Recupera 2/5', duration: 10, res: 3, rpm: 70, type: 'recovery', position: 'sentado' },
    { name: 'Sprint 3/5', duration: 20, res: 8, rpm: 110, type: 'work', position: 'parado' },
    { name: 'Recupera 3/5', duration: 10, res: 3, rpm: 70, type: 'recovery', position: 'sentado' },
    { name: 'Sprint 4/5', duration: 20, res: 8, rpm: 110, type: 'work', position: 'parado' },
    { name: 'Recupera 4/5', duration: 10, res: 3, rpm: 70, type: 'recovery', position: 'sentado' },
    { name: 'Sprint 5/5', duration: 20, res: 8, rpm: 110, type: 'work', position: 'parado' },
    { name: 'Recupera 5/5', duration: 10, res: 3, rpm: 70, type: 'recovery', position: 'sentado' },
    { name: 'Recuperación Activa', duration: 720, res: 4, rpm: 80, type: 'recovery', position: 'sentado' },
    { name: 'Sprint Final 1/2', duration: 30, res: 8, rpm: 105, type: 'work', position: 'parado' },
    { name: 'Recupera Final 1/2', duration: 15, res: 3, rpm: 70, type: 'recovery', position: 'sentado' },
    { name: 'Sprint Final 2/2', duration: 30, res: 9, rpm: 105, type: 'work', position: 'parado' },
    { name: 'Recupera Final 2/2', duration: 15, res: 3, rpm: 70, type: 'recovery', position: 'sentado' },
    { name: 'Enfriamiento Final', duration: 240, res: 2, rpm: 75, type: 'cooldown', position: 'sentado' },
  ],
};

export function buildSystemPrompt() {
  return `Eres un entrenador profesional de indoor cycling (spinning). Tu tarea es generar rutinas de entrenamiento personalizadas en formato JSON, siguiendo estrictamente las reglas y el esquema definidos abajo.

## ESQUEMA DE LA RUTINA

Cada rutina debe seguir esta estructura:
{
  "title": "Nombre descriptivo de la rutina",
  "category": "suave|hiit|fuerza|fondo",
  "description": "Descripción breve de 1-2 frases explicando el objetivo",
  "intervals": [
    {
      "name": "Nombre descriptivo del intervalo",
      "duration": <segundos, mínimo 5>,
      "res": <resistencia, 1-10>,
      "rpm": <cadencia, 30-150>,
      "type": "warmup|work|recovery|cooldown",
      "position": "sentado|parado"
    }
  ]
}

## TIPOS DE INTERVALO

- warmup: Calentamiento inicial. Resistencias bajas (2-4), RPM moderadas (75-85).
- work: Bloque de trabajo/ esfuerzo principal. Intensidad según categoría y enfoque.
- recovery: Recuperación activa entre bloques de trabajo. Resistencias bajas (2-4), RPM bajas (65-85).
- cooldown: Enfriamiento final. Resistencias mínimas (1-2), RPM bajas (65-75).

## REGLAS OBLIGATORIAS

1. EL PRIMER intervalo SIEMPRE debe ser de tipo "warmup".
2. EL ÚLTIMO intervalo SIEMPRE debe ser de tipo "cooldown".
3. **REGLA CRÍTICA DE DURACIÓN:** La suma de TODOS los intervalos en segundos DEBE ser EXACTAMENTE la duración total solicitada en segundos. Usa la calculadora mental: suma cada duration a medida que generas los intervalos. El total debe coincidir con el número indicado en el prompt del usuario. Tolerancia máxima: ±3%. Si te pasas, acorta los bloques de trabajo. Si te falta, alarga los bloques de recuperación o añade un bloque extra.
4. El warmup debe ocupar entre el 10% y 20% del tiempo total.
5. El cooldown debe ocupar entre el 5% y 15% del tiempo total.
6. Los bloques de trabajo (work) deben alternarse con bloques de recuperación (recovery).
7. NO generes dos bloques "work" consecutivos sin un "recovery" entre ellos.
8. SOLO usa posiciones que el usuario haya seleccionado en position_preference.
9. Respeta la intensidad máxima de la categoría (ver tabla abajo).
10. Adapta los bloques según el enfoque seleccionado (ver tabla abajo).
11. Usa nombres de intervalo en español, descriptivos y variados.
12. Genera entre 4 y 20 intervalos en total.
13. La resistencia (res) debe ser coherente con el tipo de intervalo y la categoría.
14. ANTES de devolver el JSON, verifica que la suma de todos los "duration" coincida con la duración solicitada. Si no, ajusta y recalcula.

## CATEGORÍAS DE INTENSIDAD

${Object.entries(CATEGORIES).map(([key, cat]) =>
  `- ${cat.label} (${key}): ${CATEGORY_GUIDELINES[key]} Resistencia máxima ${cat.maxRes}, RPM máxima ${cat.maxRpm}.`
).join('\n')}

## ENFOQUES

${Object.entries(FOCUS_GUIDELINES).map(([key, g]) =>
  `- ${key}: ${g}`
).join('\n')}

## POSICIONES VÁLIDAS

${POSITIONS.map(p => `- ${p}`).join('\n')}

## DURACIÓN TOTAL

La duración solicitada está en minutos. Debes convertirla a segundos y distribuirla en intervalos que sumen aproximadamente ese total. Cada intervalo debe tener al menos 5 segundos.

## EJEMPLO DE RESPUESTA CORRECTA

// SUMA = 300+20+10+20+10+20+10+20+10+20+10+720+30+15+30+15+240 = 1500 segundos = 25 minutos exactos
// Fíjate cómo cada "duration" contribuye a la suma total. El título incluye la duración real.
${JSON.stringify(EXAMPLE_ROUTINE, null, 2)}

## ANTES DE RESPONDER

Haz este cálculo mental: suma todos los valores "duration" uno por uno. El resultado DEBE ser exactamente la duración solicitada en segundos. Si no coincide, ajusta las duraciones y recalcula. NO entregues una rutina cuya suma no coincida.

## FORMATO DE RESPUESTA

Responde ÚNICAMENTE con el objeto JSON de la rutina. No incluyas markdown, explicaciones, comentarios ni texto adicional. Solo el JSON puro.`;
}

export function buildUserPrompt(preferences) {
  const cat = CATEGORIES[preferences.category] || {};
  const positions = preferences.position_preference || [];
  const totalSeconds = preferences.duration_minutes * 60;
  return `Genera una rutina de indoor cycling con las siguientes preferencias:

- Duración total: ${preferences.duration_minutes} minutos = **EXACTAMENTE ${totalSeconds} segundos**
- Categoría: ${cat.label || preferences.category}
- Enfoque: ${preferences.focus}
- Posiciones permitidas: ${positions.join(', ')}${preferences.extra_instructions ? `\n- Instrucciones adicionales: ${preferences.extra_instructions}` : ''}

La suma de duration de TODOS los intervalos debe ser EXACTAMENTE ${totalSeconds} segundos. Verifica la suma antes de responder.

Responde solo con el JSON.`;
}
