/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ["avatars.githubusercontent.com"],
    formats: ["image/avif", "image/webp"],
    minimumCacheTTL: 86400,
    deviceSizes: [640, 750, 828, 1080, 1200],
    imageSizes: [16, 32, 48, 64, 96],
  },
  compiler: { removeConsole: process.env.NODE_ENV === "production" },
  poweredByHeader: false,
  compress: true,
  reactStrictMode: true,
  modularizeImports: { "lucide-react": { transform: "lucide-react/dist/esm/icons/{{ member }}" } },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "X-XSS-Protection", value: "1; mode=block" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
        ],
      },
    ]
  },
}

module.exports = nextConfig