// ──────────────────────────────────────────────
//  CicloRitmo — OpenAI Provider
//  Calls OpenAI chat completions API.
//  To add a new provider (Anthropic, Gemini, etc):
//    1. Create a new file in providers/
//    2. Export a function with the same signature
//    3. Select provider via AI_PROVIDER env var
// ──────────────────────────────────────────────

const DEFAULT_MODEL = 'gpt-4o-mini';

export async function openaiGenerate({ messages, env }) {
  const apiKey = env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error('OPENAI_API_KEY no está configurada en las variables de entorno.');
  }

  const model = env.AI_MODEL || DEFAULT_MODEL;

  const res = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model,
      messages,
      temperature: 0.7,
      max_tokens: 4096,
    }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error?.message || `OpenAI API error (${res.status})`);
  }

  const data = await res.json();
  const content = data.choices?.[0]?.message?.content;

  if (!content) {
    throw new Error('OpenAI no devolvió contenido en la respuesta.');
  }

  return content;
}
