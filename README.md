# Open Assistant Platform

Next.js tabanlı basit bir sohbet uygulamasıdır. Sohbet API'si Hugging Face
Inference API üzerinden Mistral 7B Instruct modeline bağlanır ve tarayıcı
oturumundaki konuşma geçmişini bağlam olarak modele iletir.

## Gereksinimler

- Node.js 18.17 veya daha yeni bir sürüm
- npm

## Yerelde çalıştırma

```bash
cp .env.example .env.local
npm install
npm run dev
```

`.env.local` içindeki `HUGGINGFACE_API_KEY` değerini Hugging Face erişim
anahtarınızla değiştirin. Ardından
[http://localhost:3000](http://localhost:3000) adresini açın.

## Komutlar

- `npm run dev`: geliştirme sunucusunu başlatır.
- `npm run build`: üretim derlemesi oluşturur.
- `npm run start`: üretim sunucusunu başlatır.
- `npm run lint`: ESLint kontrollerini çalıştırır.

## Klasörler

- `frontend/`: sayfalar, React bileşenleri ve stiller
- `backend/`: API isteklerini işleyen sunucu kodu
- `config/`: uygulama yapılandırması
