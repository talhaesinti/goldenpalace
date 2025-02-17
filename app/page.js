// app/home/page.js

import HomeClient from './HomeClient';

async function getHomeData() {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    const [bannersResponse, toursResponse, regionsResponse] = await Promise.all([
      fetch(`${apiUrl}/api/banners?type=home&is_active=true`, {
        next: { revalidate: 86400 } // 24 saat cache
      }),
      fetch(`${apiUrl}/api/international-tours?is_active=true`, {
        next: { revalidate: 3600 } // 1 saat cache
      }),
      fetch(`${apiUrl}/api/regions?is_active=true`, {
        next: { revalidate: 43200 } // 12 saat cache
      })
    ]);

    // Hata kontrolü ve JSON parse işlemleri
    let banners = [];
    let tours = [];
    let regions = [];
    const errors = {
      bannersError: null,
      toursError: null,
      regionsError: null,
    };

    if (!bannersResponse.ok) {
      errors.bannersError = `Banner API Hatası: ${bannersResponse.status}`;
    } else {
      banners = await bannersResponse.json();
    }

    if (!toursResponse.ok) {
      errors.toursError = `Turlar API Hatası: ${toursResponse.status}`;
    } else {
      const toursData = await toursResponse.json();
      tours = toursData.slice(0, 8); // Sadece ilk 8 turu alıyoruz
    }

    if (!regionsResponse.ok) {
      errors.regionsError = `Bölgeler API Hatası: ${regionsResponse.status}`;
    } else {
      regions = await regionsResponse.json();
    }

    return {
      banners,
      tours,
      regions,
      errors
    };

  } catch (error) {
    return {
      banners: [],
      tours: [],
      regions: [],
      errors: {
        message: "Veriler yüklenirken beklenmeyen bir hata oluştu."
      }
    };
  }
}

export default async function HomePage() {
  const data = await getHomeData();

  return (
    <HomeClient 
      initialBanners={data.banners}
      initialTours={data.tours}
      initialRegions={data.regions}
      toursError={data.errors.toursError}
      regionsError={data.errors.regionsError}
    />
  );
}
