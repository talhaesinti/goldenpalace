import RegionDetailClient from './RegionDetailClient';
import regionsAPI from "../../api/regionsAPI";
import internationalToursAPI from "../../api/internationalToursAPI";

export async function generateMetadata({ params }) {
  try {
    const regionResponse = await regionsAPI.getRegionDetail(params.regionInfo);
    const region = regionResponse.data;

    if (!region || !region.is_active) {
      return {
        title: 'Bölge Bulunamadı | Golden Castle Travel',
        description: 'Aradığınız bölge bulunamadı. Lütfen diğer bölgelerimizi inceleyin.',
      };
    }

    return {
      title: `${region.name} Turları`,
      description: `Golden Castle Travel ile ${region.name} bölgesinin kültürel ve manevi değerlerini keşfedin. Size özel tur programları ve profesyonel rehberlik hizmetimizle unutulmaz bir deneyim yaşayın.`,
      keywords: [`${region.name} turları`, `${region.name} seyahat`, `${region.name} gezi`, 'kültürel turlar', 'manevi turlar', 'Golden Castle Travel'],
      openGraph: {
        title: `${region.name} Turları | Golden Castle Travel`,
        description: `Golden Castle Travel ile ${region.name} bölgesinin kültürel ve manevi değerlerini keşfedin.`,
      }
    };
  } catch (error) {
    return {
      title: 'Bölge Bulunamadı | Golden Castle Travel',
      description: 'Aradığınız bölge bulunamadı. Lütfen diğer bölgelerimizi inceleyin.',
    };
  }
}

async function RegionDetailPage({ params }) {
  try {
    const [regionResponse, toursResponse] = await Promise.all([
      regionsAPI.getRegionDetail(params.regionInfo),
      internationalToursAPI.getInternationalTours({
        is_active: true,
        region_slug: params.regionInfo,
      })
    ]);

    if (!regionResponse.data) {
      return <RegionDetailClient error="Aradığınız bölge bulunamadı. Lütfen diğer bölgelerimizi inceleyin." />;
    }

    if (!regionResponse.data.is_active) {
      return <RegionDetailClient error="Bu bölge aktif değildir. Lütfen diğer bölgelerimizi inceleyin." />;
    }

    return <RegionDetailClient initialRegion={regionResponse.data} initialTours={toursResponse.data} />;
  } catch (error) {
    return <RegionDetailClient error="Bir hata oluştu. Lütfen daha sonra tekrar deneyin." />;
  }
}

export default RegionDetailPage;