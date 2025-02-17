import React from "react";
import TourDetailClient from './TourDetailClient';

async function getInternationalTourData(slug) {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/international-tours/${slug}`, {
      next: { revalidate: 3600 } // 1 saat cache
    });

    if (!response.ok) {
      return {
        data: null,
        error: response.status === 404 
          ? "Aradığınız tur bulunamadı" 
          : "Sunucu yanıt vermedi. Lütfen daha sonra tekrar deneyin."
      };
    }

    const data = await response.json();
    return {
      data,
      error: !data || !data.is_active ? "Bu tur aktif değildir" : null
    };

  } catch (error) {
    return {
      data: null,
      error: "Beklenmeyen bir hata oluştu. Lütfen daha sonra tekrar deneyin."
    };
  }
}

export async function generateMetadata({ params }) {
  const { data: tour, error } = await getInternationalTourData(params.tour);

  if (!tour || !tour.is_active || error || tour.region.slug !== params.regionInfo) {
    return {
      title: 'Tur Bulunamadı | Golden Castle Travel',
      description: 'Aradığınız tur bulunamadı. Lütfen diğer turlarımızı inceleyin.',
    };
  }

  const startDate = new Date(tour.start_date).toLocaleDateString('tr-TR');
  const endDate = new Date(tour.end_date).toLocaleDateString('tr-TR');
  const duration = Math.ceil((new Date(tour.end_date) - new Date(tour.start_date)) / (1000 * 60 * 60 * 24));

  return {
    title: `${tour.name} | Golden Castle Travel`,
    description: `${tour.name} - ${duration} gece ${duration + 1} gün. ${startDate} - ${endDate} tarihleri arasında Golden Castle Travel ile ${tour.region.name} bölgesinde unutulmaz bir yurt dışı tur deneyimi yaşayın.`,
    keywords: [tour.name, 'yurt dışı turlar', tour.region.name, 'kültürel turlar', 'Golden Castle Travel'],
    openGraph: {
      title: `${tour.name} | Golden Castle Travel`,
      description: `${duration} gece ${duration + 1} gün. ${startDate} - ${endDate} tarihleri arasında Golden Castle Travel ile ${tour.region.name} bölgesinde unutulmaz bir yurt dışı tur deneyimi.`,
      images: tour.thumbnail ? [
        {
          url: tour.thumbnail,
          width: 1200,
          height: 630,
          alt: tour.name,
        }
      ] : undefined,
    },
    twitter: {
      card: 'summary_large_image',
      title: `${tour.name} | Golden Castle Travel`,
      description: `${duration} gece ${duration + 1} gün. ${startDate} - ${endDate} tarihleri arasında Golden Castle Travel ile ${tour.region.name} bölgesinde unutulmaz bir yurt dışı tur deneyimi.`,
      images: tour.thumbnail ? [tour.thumbnail] : undefined,
    }
  };
}

async function InternationalTourDetailPage({ params }) {
  const { data: tour, error } = await getInternationalTourData(params.tour);

  // Bölge kontrolü
  if (tour && tour.region.slug !== params.regionInfo) {
    return (
      <TourDetailClient 
        error="Bu tur farklı bir bölgeye ait. Lütfen doğru bölgeden erişmeyi deneyin."
      />
    );
  }

  return (
    <TourDetailClient 
      initialTourData={tour}
      error={error}
    />
  );
}

export default InternationalTourDetailPage;

