/** @type {import('next-sitemap').IConfig} */

// API_URL sonunda /api olmadan gelecek
const API_URL = process.env.NEXT_PUBLIC_API_URL || "https://api.goldencastletravel.com";
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://goldencastletravel.com";

// API çağrıları için yardımcı fonksiyon
async function fetchAPI(endpoint, params = {}) {
  try {
    const queryString = new URLSearchParams(params).toString();
    const headers = {
      'Content-Type': 'application/json',
    };

    // API endpoint'i düzenleme - /api/ prefix'i zaten var
    const response = await fetch(`${API_URL}${endpoint}?${queryString}`, {
      method: 'GET',
      headers,
      next: { revalidate: 60 },
    });

    if (!response.ok) {
      console.error(`API Hatası (${endpoint}): ${response.status}`);
      return { data: [] };
    }

    const data = await response.json();
    return { data };
  } catch (error) {
    console.error(`API Hatası (${endpoint}):`, error);
    return { data: [] };
  }
}

module.exports = {
  siteUrl: SITE_URL,
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
      `${SITE_URL}/sitemap.xml`
    ],
  },
  // Dinamik sayfaları oluştur
  additionalPaths: async (config) => {
    const result = [];

    try {
      console.log('🔄 API çağrıları başlatılıyor...');
      
      // Tüm API çağrılarını paralel yap - /api/ prefix'i ile
      const [domesticTours, regions, internationalTours] = await Promise.all([
        fetchAPI('/api/domestic-tours/', { is_active: true }),
        fetchAPI('/api/regions/', { is_active: true }),
        fetchAPI('/api/international-tours/', { is_active: true })
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
              loc: `${SITE_URL}/yurtici/${tour.slug}`,
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
              loc: `${SITE_URL}/yurtdisi/${region.slug}`,
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
              loc: `${SITE_URL}/yurtdisi/${tour.region.slug}/${tour.slug}`,
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