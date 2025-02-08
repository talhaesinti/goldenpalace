import React from "react";
import domesticToursAPI from "../../api/domesticToursAPI";
import DomesticTourDetailClient from './DomesticTourDetailClient';

export async function generateMetadata({ params }) {
  try {
    const tourResponse = await domesticToursAPI.getDomesticTourDetail(params.tour);
    const tour = tourResponse.data;

    if (!tour || !tour.is_active) {
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
      description: `${tour.name} - ${duration} gece ${duration + 1} gün. ${startDate} - ${endDate} tarihleri arasında Golden Castle Travel ile unutulmaz bir yurt içi tur deneyimi yaşayın.`,
      keywords: [tour.name, 'yurt içi turlar', 'kültürel turlar', 'manevi turlar', 'Golden Castle Travel'],
      openGraph: {
        title: `${tour.name} | Golden Castle Travel`,
        description: `${duration} gece ${duration + 1} gün. ${startDate} - ${endDate} tarihleri arasında Golden Castle Travel ile unutulmaz bir yurt içi tur deneyimi.`,
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

async function DomesticTourDetailPage({ params }) {
  try {
    const tourResponse = await domesticToursAPI.getDomesticTourDetail(params.tour);

    if (!tourResponse.data) {
      return <DomesticTourDetailClient error="Aradığınız tur bulunamadı. Lütfen diğer turlarımızı inceleyin." />;
    }

    if (!tourResponse.data.is_active) {
      return <DomesticTourDetailClient error="Bu tur aktif değildir. Lütfen diğer turlarımızı inceleyin." />;
    }

    return <DomesticTourDetailClient initialTourData={tourResponse.data} />;
  } catch (error) {
    return <DomesticTourDetailClient error="Bir hata oluştu. Lütfen daha sonra tekrar deneyin." />;
  }
}

export default DomesticTourDetailPage;