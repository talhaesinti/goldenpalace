import HomeClient from "./HomeClient";
import internationalToursAPI from "./api/internationalToursAPI";
import bannersAPI from "./api/bannersAPI";
import regionsAPI from "./api/regionsAPI";

const HomePage = async () => {
  let state = {
    banners: [],
    tours: null,
    regions: null,
    toursError: null,
    regionsError: null
  };

  try {
    // Banner'ları ayrı çekelim çünkü hata olsa bile göstermek istiyoruz
    const bannersResponse = await bannersAPI.getBanners({ type: "home", is_active: "true" });
    state.banners = bannersResponse.data;

    // Turlar ve bölgeleri paralel çekelim
    try {
      const toursResponse = await internationalToursAPI.getInternationalTours({ is_active: true });
      state.tours = toursResponse.data.slice(0, 8);
    } catch (error) {
      console.error("Turlar yüklenirken hata:", error);
      state.toursError = "Turlar yüklenirken bir hata oluştu. Lütfen daha sonra tekrar deneyin.";
    }

    try {
      const regionsResponse = await regionsAPI.getRegions({ is_active: true });
      state.regions = regionsResponse.data;
    } catch (error) {
      console.error("Bölgeler yüklenirken hata:", error);
      state.regionsError = "Bölgeler yüklenirken bir hata oluştu. Lütfen daha sonra tekrar deneyin.";
    }

  } catch (error) {
    console.error("Banner yüklenirken hata:", error);
    // Banner hatası olsa bile boş array ile devam ediyoruz
  }

  return (
    <HomeClient 
      initialBanners={state.banners}
      initialTours={state.tours}
      initialRegions={state.regions}
      toursError={state.toursError}
      regionsError={state.regionsError}
    />
  );
};

export default HomePage;
