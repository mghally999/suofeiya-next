/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  compress: true,
  images: {
    // AVIF first, WebP fallback — much smaller than the original JPEGs.
    formats: ['image/avif', 'image/webp'],

    // Capped deviceSizes. The original list went up to 3360 px which
    // generated huge variants the browser almost never needed; even
    // 4K displays render most of our hero images at <2K density.
    deviceSizes: [360, 480, 640, 828, 1080, 1280, 1600, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],

    minimumCacheTTL: 60 * 60 * 24 * 365
  },
  experimental: {
    optimizePackageImports: ['gsap', 'lenis']
  },
  async headers() {
    return [
      {
        source: '/:all*(svg|jpg|jpeg|png|webp|avif|woff2)',
        headers: [{ key: 'Cache-Control', value: 'public, max-age=31536000, immutable' }]
      },
      // Brotli + AVIF combined typically halves the perceived load
      // time on cellular for the cms/ image bucket.
      {
        source: '/_next/image',
        headers: [{ key: 'Cache-Control', value: 'public, max-age=31536000, immutable' }]
      }
    ];
  }
};

export default nextConfig;
