// app/yurtici/[tour]/page.js
import React from "react";
import DomesticTourDetailClient from './DomesticTourDetailClient';

async function getDomesticTourData(slug) {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/domestic-tours/${slug}`, {
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
  const { data: tour, error } = await getDomesticTourData(params.tour);

  if (!tour || !tour.is_active || error) {
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
    },
    twitter: {
      card: 'summary_large_image',
      title: `${tour.name} | Golden Castle Travel`,
      description: `${duration} gece ${duration + 1} gün. ${startDate} - ${endDate} tarihleri arasında Golden Castle Travel ile unutulmaz bir yurt içi tur deneyimi.`,
      images: tour.thumbnail ? [tour.thumbnail] : undefined,
    }
  };
}

async function DomesticTourDetailPage({ params }) {
  const { data: tour, error } = await getDomesticTourData(params.tour);

  return (
    <DomesticTourDetailClient 
      initialTourData={tour}
      error={error}
    />
  );
}

export default DomesticTourDetailPage;
