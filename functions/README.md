# CicloRitmo — Functions

Cloudflare Pages Functions que implementa el endpoint generador de rutinas IA.  
Responde en `POST /api/generate-routine`.

## Despliegue

### 1. Configurar secreto de OpenAI

```bash
npx wrangler pages secret put OPENAI_API_KEY
```

Pega tu API key de OpenAI cuando lo solicite.

### 2. Deploy del frontend + funciones

```bash
pnpm run build
npx wrangler pages deploy dist
```

La función `functions/api/generate-routine.js` se despliega automáticamente junto con el frontend.

### 3. Obtener la URL

La URL del endpoint es tu dominio de Cloudflare Pages + `/api/generate-routine`:

```
https://<tu-proyecto>.pages.dev/api/generate-routine
```

El dominio aparece en el output del deploy. También lo ves en Cloudflare Dashboard → Workers & Pages → cicloritmo → Production.

### 4. Configurar la URL en el frontend (build)

En Cloudflare Dashboard → Workers & Pages → cicloritmo → Settings → Environment variables, agrega:

| Tipo | Variable | Valor |
|---|---|---|
| **Build** | `VITE_ROUTINE_GENERATOR_URL` | `https://<tu-proyecto>.pages.dev/api/generate-routine` |

> Importante: `VITE_ROUTINE_GENERATOR_URL` debe ser variable de **build** (available at build time), no variable de función (available at runtime). Las variables de función (`[vars]` en wrangler.toml) solo las ve el runtime de la función, no Vite.

Luego redeploya (`pnpm run build && npx wrangler pages deploy dist`).

### 5. Verificar

```bash
curl -X POST https://<tu-proyecto>.pages.dev/api/generate-routine \
  -H "Content-Type: application/json" \
  -d '{
    "preferences": {
      "duration_minutes": 30,
      "category": "suave",
      "focus": "mixto",
      "position_preference": ["sentado", "parado"]
    }
  }'
```

Debe devolver `{"routine": {...}}`.

---

## Desarrollo local

### 1. Instalar dependencias de wrangler

```bash
npm install -g wrangler
```

### 2. Configurar `.dev.vars`

Edita el archivo `.dev.vars` en la raíz del proyecto:

```
OPENAI_API_KEY=sk-tu-key-real
AI_PROVIDER=openai
AI_MODEL=gpt-4o-mini
```

### 3. Ejecutar

```bash
# Terminal 1: frontend
pnpm run dev

# Terminal 2: función (expone en localhost:8788)
npx wrangler pages dev dist --port 8788
```

Crea un `.env` en la raíz con:

```
VITE_ROUTINE_GENERATOR_URL=http://localhost:8788/api/generate-routine
```

### 4. Probar desde el frontend

Abre `http://localhost:5173`, navega a Creator → pestaña "Generar con IA".

---

## Proveedores alternativos

La función está diseñada para ser provider-agnóstica. Para añadir Anthropic, Gemini u otro:

1. Crea `functions/_lib/providers/anthropic.js` con la misma firma que `openai.js`:

```js
export async function anthropicGenerate({ systemPrompt, userPrompt, env }) {
  // implementación...
  return content;
}
```

2. Modifica `functions/api/generate-routine.js` para seleccionar el provider según `env.AI_PROVIDER`.

No requiere cambios en el frontend ni en el contrato.

---

## Endpoint alternativo (sin Cloudflare)

Si usas otro backend, solo necesitas implementar un endpoint `POST` que acepte y responda según el contrato definido en `src/data/contract.js`. El frontend es completamente desacoplado: solo necesita la URL en `VITE_ROUTINE_GENERATOR_URL`.
