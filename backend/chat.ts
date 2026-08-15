export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

export interface ChatRequest {
  messages: ChatMessage[];
}

export interface ChatResponse {
  reply: string;
}

type HuggingFaceResponse = {
  choices?: Array<{ message?: { content?: string } }>;
  error?: string;
};

const HUGGING_FACE_CHAT_URL = "https://router.huggingface.co/v1/chat/completions";
const DEFAULT_MODEL = "mistralai/Mistral-7B-Instruct-v0.3";

/** Model sağlayıcısındaki ayrıntıları istemciye sızdırmadan işaretleyen hata tipi. */
export class ChatServiceError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ChatServiceError";
    Object.setPrototypeOf(this, ChatServiceError.prototype);
  }
}

/**
 * Oturumdaki bütün mesajları Hugging Face'in OpenAI uyumlu sohbet API'sine
 * gönderir. Böylece model, yalnızca son mesajı değil önceki konuşmayı da görür.
 */
export async function createModelReply(messages: ChatMessage[]): Promise<ChatResponse> {
  const apiKey = process.env.HUGGINGFACE_API_KEY;

  if (!apiKey) {
    throw new ChatServiceError("HUGGINGFACE_API_KEY yapılandırılmamış.");
  }

  let response: Response;

  try {
    response = await fetch(HUGGING_FACE_CHAT_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: process.env.HUGGINGFACE_MODEL || DEFAULT_MODEL,
        messages,
        max_tokens: 512,
        temperature: 0.7,
      }),
    });
  } catch {
    throw new ChatServiceError("Hugging Face servisine ulaşılamadı.");
  }

  const data = (await response.json().catch(() => ({}))) as HuggingFaceResponse;

  if (!response.ok) {
    // Sunucu günlüğü tanılama sağlar; API yanıtında anahtar veya sağlayıcı detayı yoktur.
    console.error("Hugging Face API hatası:", response.status, data.error);
    throw new ChatServiceError("Model şu anda yanıt veremiyor.");
  }

  const reply = data.choices?.[0]?.message?.content?.trim();

  if (!reply) {
    throw new ChatServiceError("Model boş bir yanıt döndürdü.");
  }

  return { reply };
}
