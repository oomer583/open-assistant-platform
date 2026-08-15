/** Tek bir yerde tutulan, güvenli ve istemciye açık uygulama ayarları. */
export const appConfig = {
  name: process.env.NEXT_PUBLIC_APP_NAME || "Open Assistant",
  description: "Açık kaynak asistan deneyimi için sade bir başlangıç",
} as const;
