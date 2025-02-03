/** @type {import('next').NextConfig} */
const nextConfig = {
  // React Strict Mode
  reactStrictMode: true,

  // Görsel optimizasyonu için domain izni
  images: {
    domains: ['localhost'],
  },

  // Production build ayarları
  output: 'standalone',  // Docker için optimize edilmiş build
  poweredByHeader: false,  // X-Powered-By header'ı kaldır
  compress: true,  // Gzip sıkıştırma

  // Güvenlik headers
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
          ...(process.env.NODE_ENV === 'production' 
            ? [{
                key: 'Strict-Transport-Security',
                value: 'max-age=31536000; includeSubDomains'
              }] 
            : [])
        ],
      },
    ]
  },
}

module.exports = nextConfig 