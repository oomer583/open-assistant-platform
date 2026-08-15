/** @type {import("next").NextConfig} */
const nextConfig = {
  // Backend ve config klasörleri bilinçli olarak frontend ağacının dışında tutulur.
  experimental: { externalDir: true },
};

export default nextConfig;
