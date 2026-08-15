# PRD: Açık Kaynak Modellerle Claude Benzeri Asistan Platformu

## Genel Bakış

**Amaç:** Açık kaynak / ücretsiz büyük dil modellerini kullanarak, Claude'un temel deneyimine (sohbet arayüzü, model seçimi, "düşünme" modu, sesli konuşma, giriş sistemi) yakın bir platform kurmak.

**Not:** Bu, Anthropic'in Claude API'sini ücretsiz kullanmak değildir — bunun yerine açık kaynak modelleri (Llama, Mixtral, DeepSeek vb.) kullanarak benzer bir deneyim inşa etmektir.

**Kullanım şekli:** Bu doküman, bir yapay zeka kodlama asistanına (Claude Code, Cursor vb.) tek tek, sırayla verilmek üzere küçük görevlere bölünmüştür. Her fazı ayrı bir görev/prompt olarak ver, bir öncekini bitirmeden sonrakine geçme.

---

## FAZ 0 — Proje Kurulumu

**Görev:** Temel proje iskeletini oluştur.

- Bir Next.js (veya basit bir Flask/FastAPI + React) projesi başlat.
- Klasör yapısı: `/frontend`, `/backend`, `/config`.
- `.env` dosyası için şablon oluştur (API anahtarları, model uç noktaları için).
- Basit bir "Merhaba Dünya" sohbet kutusu ile bağlantının çalıştığını doğrula.

**Kabul kriteri:** Tarayıcıda boş bir sohbet arayüzü açılıyor, mesaj gönderilebiliyor (henüz gerçek model bağlı değil).

---

## FAZ 1 — Model Katmanını Bağlama (Tek Model)

**Görev:** Tek bir ücretsiz açık kaynak modeli entegre et.

- Hugging Face Inference API veya Ollama üzerinden **Mistral 7B** ya da **Llama 3 8B** modelini bağla.
- Backend'de `/api/chat` uç noktası oluştur: kullanıcı mesajını al, modele gönder, cevabı döndür.
- Sohbet geçmişini (context) oturum içinde tut.

**Kabul kriteri:** Kullanıcı bir soru sorduğunda gerçek model cevap veriyor, önceki mesajları hatırlıyor.

---

## FAZ 2 — Çoklu Model Desteği (Model Seçici)

**Görev:** Claude'un farklı model seviyelerine (Haiku/Sonnet/Opus) benzer şekilde, kullanıcının model seçebileceği bir yapı kur.

Önerilen eşleştirme:
| Claude seviyesi | Açık kaynak karşılığı | Nereden |
|---|---|---|
| Haiku (hızlı/küçük) | Phi-3 veya Mistral 7B | Hugging Face / Ollama |
| Sonnet (orta) | Llama 3 70B veya Mixtral 8x7B | Hugging Face / Groq (ücretsiz katman) |
| Opus (güçlü) | Llama 3.1 405B | Hugging Face (kaynak yoğun, dikkatli kullan) |

- Arayüze bir açılır menü (dropdown) ekle: kullanıcı hangi modeli kullanacağını seçsin.
- Backend'de model adına göre doğru API/uç noktaya yönlendirme mantığı kur.

**Kabul kriteri:** Kullanıcı menüden model değiştirdiğinde farklı modelden cevap geldiği gözlemlenebiliyor.

---

## FAZ 3 — "Düşünme" (Thinking) Modu

**Görev:** Claude'un "extended thinking" moduna benzer bir seçenek ekle.

- Model listesine "düşünme modu açık" seçeneği ekle (örn. DeepSeek-R1 gibi akıl yürütme odaklı bir açık kaynak model kullan, ya da normal modele "adım adım düşün" sistem talimatı ver).
- Arayüzde bu modun cevaptan önce ekstra süre alabileceğine dair bir yükleniyor göstergesi ekle.

**Kabul kriteri:** Düşünme modu açıkken cevaplar daha uzun sürede ama daha detaylı akıl yürütmeyle geliyor.

---

## FAZ 4 — Kullanıcı Girişi (Auth) ve Ayarlar

**Görev:** Basit bir kullanıcı sistemi kur.

- E-posta/şifre ile kayıt ve giriş (örneğin Supabase Auth veya Firebase Auth — ikisi de ücretsiz katmana sahip).
- Kullanıcı ayarları sayfası: tercih edilen model, yanıt tarzı (kısa/uzun/samimi/resmi) gibi basit tercihler.
- Sohbet geçmişinin kullanıcıya özel saklanması (veritabanı: Supabase/Postgres ücretsiz katman).

**Kabul kriteri:** Kullanıcı giriş yapabiliyor, çıkış yapıp tekrar girdiğinde geçmiş sohbetleri görebiliyor.

---

## FAZ 5 — Konuşma Tarzı / Sistem Talimatı

**Görev:** Claude'un sıcak, yardımsever konuşma tarzına yakın bir "kişilik" tanımla.

- Modele gönderilen sistem talimatına (system prompt) bir "karakter tanımı" ekle: nazik, net, gereksiz uzatmayan, dürüst bir asistan tonu.
- Kullanıcının bunu ayarlar sayfasından hafifçe özelleştirebilmesini sağla (örn. "resmi" / "samimi" seçeneği).

**Kabul kriteri:** Farklı ton ayarlarında modelin cevap tarzı gözle görülür şekilde değişiyor.

---

## FAZ 6 — Sesli Konuşma (STT + TTS)

**Görev:** Sesle konuşabilme özelliği ekle.

- **Konuşmayı metne çevirme (STT):** Whisper (açık kaynak, ücretsiz, yerel çalıştırılabilir) veya tarayıcının kendi Web Speech API'si.
- **Metni sese çevirme (TTS):** Google TTS ücretsiz kotası veya açık kaynak Coqui TTS / Piper TTS.
- Arayüze mikrofon butonu ekle, basılı tutunca konuşma metne çevrilsin, cevap otomatik seslendirilsin.

**Kabul kriteri:** Kullanıcı mikrofona konuşabiliyor, cevabı sesli olarak duyabiliyor.

---

## FAZ 7 — Görsel Anlama (Multimodal)

**Görev:** Resim yükleyip hakkında soru sorabilme.

- Açık kaynak çoklu-modlu bir model bağla (örn. LLaVA veya Qwen-VL, ikisi de Hugging Face üzerinde ücretsiz).
- Arayüze resim yükleme butonu ekle.

**Kabul kriteri:** Kullanıcı bir resim yükleyip "bu ne?" diye sorduğunda anlamlı bir cevap alıyor.

---

## FAZ 8 — Cilalama ve Yayınlama

**Görev:** Ürünü kullanıma hazır hale getir.

- Arayüz tasarımını sadeleştir (Claude'un sade, beyaz/krem tonlu tasarımından ilham alabilirsin, birebir kopyalama).
- Hata yönetimi ekle (model cevap vermezse kullanıcıya nazik bir hata mesajı göster).
- Ücretsiz bir sunucuda yayınla (Vercel + Supabase kombinasyonu iyi bir başlangıç).

**Kabul kriteri:** Site canlıda, arkadaşların gerçek bir bağlantıdan giriş yapıp kullanabiliyor.

---

## Genel Notlar

- Her fazı bitirmeden diğerine geçme — yapay zeka asistanına net kapsamla küçük görevler vermek, karmaşık ve yarım kalan projelerin önüne geçer.
- Anthropic'in Claude ismini, logosunu veya marka kimliğini birebir kopyalamak (isim, logo, marka) telif/ticari marka sorunlarına yol açabilir — kendi ismini ve kimliğini kullan, sadece deneyimden ilham al.
- Büyük modelleri (405B gibi) çalıştırmak ciddi donanım/bulut maliyeti gerektirir; başlangıçta orta seviye modellerle devam etmek daha gerçekçi.
