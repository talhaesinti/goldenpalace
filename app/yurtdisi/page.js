import InternationalTourClient from './InternationalTourClient';
import bannersAPI from "../api/bannersAPI";
import regionsAPI from "../api/regionsAPI";

async function InternationalTourPage() {
  try {
    const [bannersResponse, regionsResponse] = await Promise.all([
      bannersAPI.getBanners({
        type: "international",
        is_active: "true",
      }),
      regionsAPI.getRegions({
        is_active: true,
      })
    ]);

    return (
      <InternationalTourClient 
        initialBanners={bannersResponse.data} 
        initialRegions={regionsResponse.data} 
      />
    );
  } catch (error) {
    console.error("Veri yüklenirken hata oluştu:", error);
    return (
      <InternationalTourClient 
        error="Veriler yüklenirken bir hata oluştu. Lütfen sayfayı yenileyin."
      />
    );
  }
}

export default InternationalTourPage;
