import DomesticTourClient from './DomesticTourClient';
import bannersAPI from "../api/bannersAPI";
import domesticToursAPI from "../api/domesticToursAPI";

async function DomesticTourPage() {
  try {
    const [bannersResponse, toursResponse] = await Promise.all([
      bannersAPI.getBanners({
        type: "domestic",
        is_active: "true",
      }),
      domesticToursAPI.getDomesticTours({
        is_active: true,
      })
    ]);

    return (
      <DomesticTourClient 
        initialBanners={bannersResponse.data} 
        initialTours={toursResponse.data} 
      />
    );
  } catch (error) {
    console.error("Veri yüklenirken hata oluştu:", error);
    return (
      <DomesticTourClient 
        error="Veriler yüklenirken bir hata oluştu. Lütfen sayfayı yenileyin."
      />
    );
  }
}

export default DomesticTourPage;
