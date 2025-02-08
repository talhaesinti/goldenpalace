/** @type {import('next-sitemap').IConfig} */

const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://api.goldencastletravel.com/api";

// API çağrıları için yardımcı fonksiyon
async function fetchAPI(endpoint, params = {}) {
  try {
    const queryString = new URLSearchParams(params).toString();
    const headers = {
      'Content-Type': 'application/json',
    };

    // API URL'de zaten /api var, tekrar eklemeye gerek yok
    const response = await fetch(`${API_URL}${endpoint}?${queryString}`, {
      method: 'GET',
      headers,
      next: { revalidate: 60 },
    });

    if (!response.ok) {
      throw new Error(`API yanıt vermedi: ${response.status}`);
    }

    const data = await response.json();
    return { data }; // API yanıtını data property'si içinde döndürüyoruz
  } catch (error) {
    console.error(`API Hatası (${endpoint}):`, error);
    return { data: [] };
  }
}

module.exports = {
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL || "https://goldencastletravel.com",
  generateRobotsTxt: true,
  sitemapSize: 5000,
  changefreq: 'daily',
  priority: 0.7,
  exclude: ['/api/*', '/_next/*', '/404', '/500'],
  robotsTxtOptions: {
    policies: [
      { 
        userAgent: "*",
        allow: ["/", "/yurtici", "/yurtdisi", "/hakkimizda", "/iletisim", "/images", "/sitemap.xml"],
        disallow: [
          '/api/*',
          '/_next/*',
          '/404',
          '/500',
          '/*?*',
          '/*/[*'
        ]
      }
    ],
    additionalSitemaps: [
      `${process.env.NEXT_PUBLIC_SITE_URL || "https://goldencastletravel.com"}/sitemap.xml`
    ],
  },
  // Dinamik sayfaları oluştur
  additionalPaths: async (config) => {
    const result = [];
    const siteUrl = config.siteUrl;

    try {
      console.log('🔄 API çağrıları başlatılıyor...');
      
      // Tüm API çağrılarını paralel yap
      const [domesticTours, regions, internationalTours] = await Promise.all([
        fetchAPI('/domestic-tours/', { is_active: true }),
        fetchAPI('/regions/', { is_active: true }),
        fetchAPI('/international-tours/', { is_active: true })
      ]);

      console.log(`✅ API yanıtları alındı:
        - Yurt İçi Turlar: ${domesticTours.data?.length || 0}
        - Bölgeler: ${regions.data?.length || 0}
        - Yurt Dışı Turlar: ${internationalTours.data?.length || 0}
      `);

      // Yurt içi turlar
      if (Array.isArray(domesticTours.data)) {
        for (const tour of domesticTours.data) {
          if (tour.slug) {
            result.push({
              loc: `${siteUrl}/yurtici/${tour.slug}`,
              lastmod: tour.updated_at || new Date().toISOString(),
              changefreq: 'weekly',
              priority: 0.7
            });
          }
        }
      }

      // Bölgeler
      if (Array.isArray(regions.data)) {
        for (const region of regions.data) {
          if (region.slug) {
            result.push({
              loc: `${siteUrl}/yurtdisi/${region.slug}`,
              lastmod: new Date().toISOString(),
              changefreq: 'weekly',
              priority: 0.7
            });
          }
        }
      }

      // Yurt dışı turlar
      if (Array.isArray(internationalTours.data)) {
        for (const tour of internationalTours.data) {
          if (tour.region?.slug && tour.slug) {
            result.push({
              loc: `${siteUrl}/yurtdisi/${tour.region.slug}/${tour.slug}`,
              lastmod: tour.updated_at || new Date().toISOString(),
              changefreq: 'weekly',
              priority: 0.7
            });
          }
        }
      }

      console.info(`✅ Dinamik sayfalar oluşturuldu: ${result.length} sayfa`);
    } catch (error) {
      console.error('❌ Dinamik sayfa oluşturma hatası:', error);
    }

    return result;
  },
  transform: async (config, path) => {
    // Özel öncelik ve güncelleme sıklığı ayarları
    const priorityMap = {
      '/': 1.0,
      '/yurtici': 0.8,
      '/yurtdisi': 0.8,
      '/hakkimizda': 0.5,
      '/iletisim': 0.5
    };

    const changefreqMap = {
      '/': 'daily',
      '/yurtici': 'daily',
      '/yurtdisi': 'daily',
      '/hakkimizda': 'monthly',
      '/iletisim': 'monthly'
    };

    return {
      loc: path,
      changefreq: changefreqMap[path] || config.changefreq,
      priority: priorityMap[path] || config.priority,
      lastmod: new Date().toISOString(),
      alternateRefs: []
    };
  }
}; 