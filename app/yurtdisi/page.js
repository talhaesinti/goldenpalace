import InternationalTourClient from './InternationalTourClient';

async function getInternationalData() {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    const [bannersResponse, regionsResponse] = await Promise.all([
      fetch(`${apiUrl}/api/banners?type=international&is_active=true`, {
        next: { revalidate: 86400 } // 24 saat (1 gün) boyunca cache'lenmiş veri kullan
      }),
      fetch(`${apiUrl}/api/regions?is_active=true`, {
        next: { revalidate: 43200 } // 12 saat (yarım gün) boyunca cache'lenmiş veri kullan
      })
    ]);

    if (!bannersResponse.ok || !regionsResponse.ok) {
      return {
        banners: [],
        regions: [],
        errors: {
          message: `API_ERROR`
        }
      };
    }

    const [banners, regions] = await Promise.all([
      bannersResponse.json(),
      regionsResponse.json()
    ]);

    return {
      banners,
      regions,
      errors: null
    };

  } catch (error) {
    return {
      banners: [],
      regions: [],
      errors: {
        message: "Veriler yüklenirken beklenmeyen bir hata oluştu."
      }
    };
  }
}

export default async function InternationalTourPage() {
  const data = await getInternationalData();

  return (
    <InternationalTourClient 
      initialBanners={data.banners}
      initialRegions={data.regions}
      serverError={data.errors}
    />
  );
}
