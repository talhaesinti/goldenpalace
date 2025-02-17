import RegionDetailClient from './RegionDetailClient';
import React from 'react';

async function getRegionData(regionInfo) {
  try {
    const [regionResponse, toursResponse] = await Promise.all([
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/regions/${regionInfo}`, {
        next: { revalidate: 43200 }
      }),
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/international-tours?is_active=true&region_slug=${regionInfo}`, {
        next: { revalidate: 3600 }
      })
    ]);

    // Özel olarak 404 kontrolü
    if (regionResponse.status === 404) {
      return {
        region: null,
        tours: [],
        error: { message: "Böyle bir bölge bulunmamaktadır. Lütfen diğer bölgelerimizi inceleyin." }
      };
    }

    // Diğer başarısız durumlar (örn. 500, 403 vs.)
    if (!regionResponse.ok || !toursResponse.ok) {
      return {
        region: null,
        tours: [],
        error: { message: "API_ERROR" }
      };
    }

    // JSON parse
    const [region, tours] = await Promise.all([
      regionResponse.json(),
      toursResponse.json()
    ]);

    // Eğer region JSON parse sonrası da null geliyorsa
    if (!region) {
      return {
        region: null,
        tours: [],
        error: { message: "Böyle bir bölge bulunmamaktadır. Lütfen diğer bölgelerimizi inceleyin." }
      };
    }

    return {
      region,
      tours,
      error: null
    };

  } catch (err) {
    // Fetch veya ağ hatası
    return {
      region: null,
      tours: [],
      error: { message: "API_ERROR" }
    };
  }
}

export async function generateMetadata({ params }) {
  const { region, error } = await getRegionData(params.regionInfo);

  if (error || !region || !region.is_active) {
    return {
      title: 'Bölge Bulunamadı | Golden Castle Travel',
      description: 'Aradığınız bölge bulunamadı. Lütfen diğer bölgelerimizi inceleyin.',
    };
  }
  
  return {
    title: `${region.name} Turları | Golden Castle Travel`,
    description: `Golden Castle Travel ile ${region.name} bölgesinin kültürel ve manevi değerlerini keşfedin.`,
    keywords: [
      `${region.name} turları`, 
      `${region.name} seyahat`, 
      `${region.name} gezi`, 
      'kültürel turlar', 
      'manevi turlar', 
      'Golden Castle Travel'
    ],
    openGraph: {
      title: `${region.name} Turları | Golden Castle Travel`,
      description: `Golden Castle Travel ile ${region.name} bölgesinin kültürel ve manevi değerlerini keşfedin.`,
      images: region.thumbnail ? [
        {
          url: region.thumbnail,
          width: 1200,
          height: 630,
          alt: `${region.name} Turları`,
        }
      ] : undefined,
    },
    twitter: {
      card: 'summary_large_image',
      title: `${region.name} Turları | Golden Castle Travel`,
      description: `Golden Castle Travel ile ${region.name} bölgesinin kültürel ve manevi değerlerini keşfedin.`,
      images: region.thumbnail ? [region.thumbnail] : undefined,
    }
  };
}

async function RegionDetailPage({ params }) {
  const { region, tours, error } = await getRegionData(params.regionInfo);

  return (
    <RegionDetailClient 
      initialRegion={region}
      initialTours={tours}
      serverError={error}
    />
  );
}

export default RegionDetailPage;