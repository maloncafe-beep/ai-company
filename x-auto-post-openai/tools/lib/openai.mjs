const OPENAI_API_URL = process.env.OPENAI_API_URL || "https://api.openai.com/v1/responses";
const DEFAULT_OPENAI_MODEL = process.env.OPENAI_MODEL || "gpt-4.1";

export function getOpenAIModel() {
  return process.env.OPENAI_MODEL || DEFAULT_OPENAI_MODEL;
}

export function hasOpenAIKey() {
  return Boolean(process.env.OPENAI_API_KEY);
}

function extractOutputText(payload) {
  if (!payload || !Array.isArray(payload.output)) return "";

  for (const item of payload.output) {
    if (!Array.isArray(item.content)) continue;
    for (const content of item.content) {
      if (content.type === "output_text" && typeof content.text === "string") {
        return content.text;
      }
    }
  }

  return "";
}

export async function createOpenAITextResponse(prompt, options = {}) {
  if (!hasOpenAIKey()) {
    throw new Error("OPENAI_API_KEY が .env に設定されていません");
  }

  const body = {
    model: options.model || getOpenAIModel(),
    input: prompt,
    text: {
      format: {
        type: "text",
      },
    },
  };

  if (options.maxOutputTokens) {
    body.max_output_tokens = options.maxOutputTokens;
  }

  const response = await fetch(OPENAI_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
    },
    body: JSON.stringify(body),
  });

  const payload = await response.json().catch(() => ({}));
  if (!response.ok) {
    const message = payload?.error?.message || `OpenAI API request failed with status ${response.status}`;
    throw new Error(message);
  }

  const text = extractOutputText(payload).trim();
  if (!text) {
    throw new Error("OpenAI の応答からテキストを抽出できませんでした");
  }

  return text;
}
