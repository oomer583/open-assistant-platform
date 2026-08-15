"use client";

import { FormEvent, useState } from "react";

import { appConfig } from "@/config/app";

type Message = {
  id: number;
  role: "user" | "assistant";
  content: string;
  isError?: boolean;
};

/** Mesajları yalnızca bu tarayıcı oturumunda tutan temel sohbet bileşeni. */
export function Chat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isSending, setIsSending] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const content = input.trim();

    if (!content || isSending) return;

    const userMessage: Message = { id: Date.now(), role: "user", content };
    // Önceki geçici hata bildirimleri modele bağlam olarak gönderilmez.
    const conversation = [...messages.filter((message) => !message.isError), userMessage];
    setMessages((current) => [...current, userMessage]);
    setInput("");
    setIsSending(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: conversation.map(({ role, content: messageContent }) => ({
            role,
            content: messageContent,
          })),
        }),
      });

      const data = (await response.json()) as { reply?: string; error?: string };

      if (!response.ok) {
        throw new Error(data.error || "Sohbet isteği başarısız oldu.");
      }

      // API beklenmedik biçimde reply alanını atsa bile Message.content daima string kalır.
      const reply = data.reply ?? "Bir hata oluştu, lütfen tekrar deneyin.";

      setMessages((current) => [
        ...current,
        { id: Date.now() + 1, role: "assistant", content: reply },
      ]);
    } catch (error) {
      setMessages((current) => [
        ...current,
        {
          id: Date.now() + 1,
          role: "assistant",
          content:
            error instanceof Error
              ? error.message
              : "Üzgünüm, mesaj gönderilemedi. Lütfen tekrar deneyin.",
          isError: true,
        },
      ]);
    } finally {
      setIsSending(false);
    }
  }

  return (
    <section className="chat" aria-label="Sohbet">
      <header className="chat__header">
        <span className="chat__mark" aria-hidden="true">O</span>
        <div>
          <h1>{appConfig.name}</h1>
          <p>Size nasıl yardımcı olabilirim?</p>
        </div>
      </header>

      <div className="chat__messages" aria-live="polite">
        {messages.length === 0 ? (
          <div className="chat__empty">
            <h2>Yeni bir sohbet başlatın</h2>
            <p>Bir mesaj yazın; asistan konuşmanızın bağlamını koruyarak yanıtlasın.</p>
          </div>
        ) : (
          messages.map((message) => (
            <article className={`message message--${message.role}`} key={message.id}>
              <span>{message.role === "user" ? "Siz" : "Asistan"}</span>
              <p>{message.content}</p>
            </article>
          ))
        )}
      </div>

      <form className="composer" onSubmit={handleSubmit}>
        <label className="sr-only" htmlFor="message">Mesajınız</label>
        <input
          id="message"
          value={input}
          onChange={(event) => setInput(event.target.value)}
          placeholder="Mesajınızı yazın…"
          autoComplete="off"
          disabled={isSending}
        />
        <button type="submit" disabled={!input.trim() || isSending}>
          {isSending ? "Gönderiliyor…" : "Gönder"}
        </button>
      </form>
    </section>
  );
}
