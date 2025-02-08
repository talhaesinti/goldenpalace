/** @type {import('next').NextConfig} */


const nextConfig = ({
  // React Strict Mode
  reactStrictMode: true,

  // Görsel optimizasyonu için pattern izni
  images: {
    domains: ['127.0.0.1', 'localhost', 'api.goldencastletravel.com'], 
    remotePatterns: [
      {
        protocol: 'http',
        hostname: '127.0.0.1',
        port: '8000',
        pathname: '/media/**',
      },
      {
        protocol: 'https',
        hostname: 'api.goldencastletravel.com',
        pathname: '/media/**',
      },
      {
        protocol: 'https',
        hostname: '**',
      }
    ],
  },

  // Production build ayarları
  output: 'standalone',  // Docker için optimize edilmiş build
  poweredByHeader: false,  // X-Powered-By header'ı kaldır
  compress: true,  // Gzip sıkıştırma

  // Güvenlik ve performans headers
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY'  // Clickjacking koruması
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'  // MIME type sniffing koruması
          },
          {
            key: 'Content-Security-Policy',
            value: "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https: http:; font-src 'self' data:; connect-src 'self' https://api.goldencastletravel.com;"
          },
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable'
          },
          ...(process.env.NODE_ENV === 'production' 
            ? [
                {
                  key: 'Strict-Transport-Security',
                  value: 'max-age=31536000; includeSubDomains'
                },
                {
                  key: 'Permissions-Policy',
                  value: 'camera=(), microphone=(), geolocation=()'
                }
              ] 
            : [])
        ],
      },
      {
        source: '/api/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'no-store'
          }
        ]
      }
    ]
  },
});

module.exports = nextConfig;
