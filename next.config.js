/** @type {import('next').NextConfig} */

const nextConfig = {
  // React Strict Mode (prod’da true veya false tercihinize bağlı)
  reactStrictMode: true,

  // Görsel optimizasyonu için sadece prod ayarları
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'api.goldencastletravel.com',
        pathname: '/api/**',
      },
      {
        protocol: 'https',
        hostname: 'api.goldencastletravel.com',
        pathname: '/media/**',
      },
      {
        protocol: 'https',
        hostname: 'fakeimg.pl',
        pathname: '/**',
      }
    ],
  },

  // Production build ayarları
  output: 'standalone',
  poweredByHeader: false,
  compress: true,

  // Güvenlik headers – Google Maps embed ve sitenizin başka sitelerde görünmesine izin verecek şekilde düzenlendi
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          // X-Frame-Options: 'DENY' ve frame-ancestors direktifi kaldırıldı
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { 
            key: 'Content-Security-Policy',
            value: `
              default-src 'self';
              script-src 'self' 'unsafe-inline' 'unsafe-eval' https://*.googleapis.com https://*.gstatic.com;
              style-src 'self' 'unsafe-inline' https://*.googleapis.com;
              img-src 'self' data: https: http: blob:;
              font-src 'self' data: https://*.gstatic.com;
              connect-src 'self' https://api.goldencastletravel.com ws: wss:;
              frame-src https://www.google.com https://*.google.com;
              media-src 'self';
              object-src 'none';
              base-uri 'self';
              form-action 'self';
            `.replace(/\s+/g, ' ').trim(),
          }
        ],
      },
      // Production'a özel ek güvenlik header'ları
      ...(process.env.NODE_ENV === 'production'
        ? [
            {
              source: '/:path*',
              headers: [
                { key: 'Strict-Transport-Security', value: 'max-age=31536000; includeSubDomains' },
                { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=(), fullscreen=()' },
              ],
            },
          ]
        : []),
    ];
  },
};

module.exports = nextConfig;