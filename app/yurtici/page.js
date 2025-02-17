import DomesticTourClient from './DomesticTourClient';

async function getDomesticData() {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    const [toursResponse, bannersResponse] = await Promise.all([
      fetch(`${apiUrl}/api/domestic-tours`, {
        next: { revalidate: 43200 } // 12 saat cache
      }),
      fetch(`${apiUrl}/api/banners?type=domestic&is_active=true`, {
        next: { revalidate: 86400 } // 24 saat cache
      })
    ]);

    if (!toursResponse.ok || !bannersResponse.ok) {
      return {
        tours: [],
        banners: [],
        errors: {
          message: `API Hatası: ${toursResponse.status} - ${bannersResponse.status}`
        }
      };
    }

    const [tours, banners] = await Promise.all([
      toursResponse.json(),
      bannersResponse.json()
    ]);

    return {
      tours,
      banners,
      errors: null
    };

  } catch (error) {
    return {
      tours: [],
      banners: [],
      errors: {
        message: "Veriler yüklenirken beklenmeyen bir hata oluştu."
      }
    };
  }
}

export default async function DomesticTourPage() {
  const data = await getDomesticData();

  return (
    <DomesticTourClient 
      initialBanners={data.banners}
      initialTours={data.tours}
      serverError={data.errors}
    />
  );
}

