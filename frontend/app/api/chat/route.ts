import { NextResponse } from "next/server";

import {
  ChatServiceError,
  createModelReply,
  type ChatMessage,
  type ChatRequest,
} from "@/backend/chat";

function isChatMessage(value: unknown): value is ChatMessage {
  if (!value || typeof value !== "object") return false;

  const message = value as Partial<ChatMessage>;
  return (
    (message.role === "user" || message.role === "assistant") &&
    typeof message.content === "string" &&
    message.content.trim().length > 0
  );
}

/** İstemciden gelen sohbet geçmişini doğrular ve gerçek modele iletir. */
export async function POST(request: Request) {
  let body: Partial<ChatRequest>;

  try {
    body = (await request.json()) as Partial<ChatRequest>;
  } catch {
    return NextResponse.json({ error: "Geçersiz istek." }, { status: 400 });
  }

  if (
    !Array.isArray(body.messages) ||
    body.messages.length === 0 ||
    !body.messages.every(isChatMessage) ||
    body.messages.at(-1)?.role !== "user"
  ) {
    return NextResponse.json({ error: "Geçerli bir sohbet geçmişi gönderin." }, { status: 400 });
  }

  try {
    // Backend boş yanıtları hata olarak ele alır; başarılı API sözleşmesi daima string reply döndürür.
    const { reply } = await createModelReply(body.messages);
    return NextResponse.json({ reply });
  } catch (error) {
    if (error instanceof ChatServiceError) {
      return NextResponse.json(
        {
          error: "Üzgünüm, model şu anda yanıt veremiyor. Lütfen biraz sonra tekrar deneyin.",
          // GEÇİCİ: Geliştirme tamamlandığında sağlayıcı hata detayını response'tan kaldırın.
          debug: error.message,
        },
        { status: 502 },
      );
    }

    console.error("Beklenmeyen sohbet hatası:", error);
    return NextResponse.json(
      { error: "Üzgünüm, beklenmeyen bir sorun oluştu. Lütfen tekrar deneyin." },
      { status: 500 },
    );
  }
}
