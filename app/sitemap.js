import internationalToursAPI from './api/internationalToursAPI';
import domesticToursAPI from './api/domesticToursAPI';
import regionsAPI from './api/regionsAPI';

const URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://goldencastletravel.com';

export default async function sitemap() {
  // Statik sayfalar
  const staticPages = [
    { url: `${URL}`, lastModified: new Date().toISOString(), changefreq: 'daily', priority: 1 },
    { url: `${URL}/yurtici`, lastModified: new Date().toISOString(), changefreq: 'daily', priority: 0.8 },
    { url: `${URL}/yurtdisi`, lastModified: new Date().toISOString(), changefreq: 'daily', priority: 0.8 },
    { url: `${URL}/hakkimizda`, lastModified: new Date().toISOString(), changefreq: 'monthly', priority: 0.5 },
    { url: `${URL}/iletisim`, lastModified: new Date().toISOString(), changefreq: 'monthly', priority: 0.5 },
  ];

  try {
    // API isteklerini paralel çalıştır (Daha hızlı)
    const [domesticResponse, regionsResponse, internationalResponse] = await Promise.all([
      domesticToursAPI.getDomesticTours({ is_active: true }).catch(err => ({ data: [] })),
      regionsAPI.getRegions({ is_active: true }).catch(err => ({ data: [] })),
      internationalToursAPI.getInternationalTours({ is_active: true }).catch(err => ({ data: [] })),
    ]);

    // Yurtiçi turlar
    const domesticTours = (domesticResponse?.data || []).map((tour) => ({
      url: `${URL}/yurtici/${tour.slug}`,
      lastModified: tour.updated_at ? new Date(tour.updated_at).toISOString() : new Date().toISOString(),
      changefreq: 'weekly',
      priority: 0.7,
    }));

    // Yurtdışı bölgeler
    const regions = (regionsResponse?.data || []).map((region) => ({
      url: `${URL}/yurtdisi/${region.slug}`,
      lastModified: new Date().toISOString(),
      changefreq: 'weekly',
      priority: 0.7,
    }));

    // Yurtdışı turlar
    const internationalTours = (internationalResponse?.data || []).map((tour) => ({
      url: `${URL}/yurtdisi/${tour.region.slug}/${tour.slug}`,
      lastModified: tour.updated_at ? new Date(tour.updated_at).toISOString() : new Date().toISOString(),
      changefreq: 'weekly',
      priority: 0.7,
    }));

    // Boş olmayan dizileri birleştir
    const allPages = [
      ...staticPages,
      ...(domesticTours.length ? domesticTours : []),
      ...(regions.length ? regions : []),
      ...(internationalTours.length ? internationalTours : [])
    ];
    
    console.info(`✅ Sitemap oluşturuldu: ${allPages.length} sayfa`);
    return allPages;

  } catch (error) {
    console.error('❌ Sitemap oluşturulurken hata:', error);
    
    if (error.response) {
      console.error('🔍 API Hata Detayları:', {
        status: error.response.status,
        data: error.response.data,
        headers: error.response.headers,
      });
    } else if (error.request) {
      console.error('🌐 Ağ Hatası:', error.message);
    } else {
      console.error('⚠️ Beklenmeyen Hata:', error.message);
    }

    // Hata durumunda statik sayfaları döndür
    console.info('ℹ️ Sadece statik sayfalar sitemap\'e eklendi');
    return staticPages;
  }
}
