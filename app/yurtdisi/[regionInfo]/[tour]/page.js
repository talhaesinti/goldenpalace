import TourDetailClient from './TourDetailClient';
import internationalToursAPI from "../../../api/internationalToursAPI";

export async function generateMetadata({ params }) {
  try {
    const tourResponse = await internationalToursAPI.getInternationalTourDetail(params.tour);
    const tour = tourResponse.data;

    if (!tour || tour.region.slug !== params.regionInfo) {
      return {
        title: 'Tur Bulunamadı | Golden Castle Travel',
        description: 'Aradığınız tur bulunamadı. Lütfen diğer turlarımızı inceleyin.',
      };
    }

    const startDate = new Date(tour.start_date).toLocaleDateString('tr-TR');
    const endDate = new Date(tour.end_date).toLocaleDateString('tr-TR');
    const duration = Math.ceil((new Date(tour.end_date) - new Date(tour.start_date)) / (1000 * 60 * 60 * 24));

    return {
      title: tour.name,
      description: `${tour.name} - ${duration} gece ${duration + 1} gün. ${startDate} - ${endDate} tarihleri arasında Golden Castle Travel ile ${tour.region.name} bölgesinde unutulmaz bir tur deneyimi yaşayın.`,
      keywords: [tour.name, `${tour.region.name} turları`, 'yurt dışı turlar', 'kültürel turlar', 'manevi turlar', 'Golden Castle Travel'],
      openGraph: {
        title: `${tour.name} | Golden Castle Travel`,
        description: `${duration} gece ${duration + 1} gün. ${startDate} - ${endDate} tarihleri arasında Golden Castle Travel ile ${tour.region.name} bölgesinde unutulmaz bir tur deneyimi.`,
        images: tour.thumbnail ? [
          {
            url: tour.thumbnail,
            width: 1200,
            height: 630,
            alt: tour.name,
          }
        ] : undefined,
      }
    };
  } catch (error) {
    return {
      title: 'Tur Bulunamadı | Golden Castle Travel',
      description: 'Aradığınız tur bulunamadı. Lütfen diğer turlarımızı inceleyin.',
    };
  }
}

async function TourDetailPage({ params }) {
  try {
    const tourResponse = await internationalToursAPI.getInternationalTourDetail(params.tour);

    if (!tourResponse.data) {
      return <TourDetailClient error="Aradığınız tur bulunamadı. Lütfen diğer turlarımızı inceleyin." />;
    }

    if (tourResponse.data.region.slug !== params.regionInfo) {
      return <TourDetailClient error="Bu tur farklı bir bölgeye ait. Lütfen doğru bölgeden erişmeyi deneyin." />;
    }

    if (!tourResponse.data.is_active) {
      return <TourDetailClient error="Bu tur aktif değildir. Lütfen diğer turlarımızı inceleyin." />;
    }

    return <TourDetailClient initialTourData={tourResponse.data} />;
  } catch (error) {
    return <TourDetailClient error="Bir hata oluştu. Lütfen daha sonra tekrar deneyin." />;
  }
}

export default TourDetailPage;
