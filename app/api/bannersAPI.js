import axios from "axios";
import config from "../config";

const bannersAPI = {
    // Tüm bannerları listele (GET işlemi için token gerekmiyor)
    async getBanners(params = {}) {
        const endpoint = `${config.url}/api/banners/`;
        try {
          const response = await axios.get(endpoint, { params });
          return response;
        } catch (error) {
          throw error;
        }
      },

    // Belirli bir banner'ın detayını al (GET işlemi için token gerekmiyor)
    async getBannerDetail(bannerId) {
        const endpoint = `${config.url}/api/banners/${bannerId}/`;
        return await axios
            .get(endpoint)
            .then((response) => response)
            .catch((error) => {
                throw error;
            });
    },

    // Yeni bir banner oluştur (POST işlemi için token gerekiyor)
    async createBanner(bannerData, token) {
        const endpoint = `${config.url}/api/banners/`;
        return await axios
            .post(endpoint, bannerData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
            .then((response) => response)
            .catch((error) => {
                throw error;
            });
    },

    // Mevcut bir banner'ı güncelle (PUT işlemi için token gerekiyor)
    async updateBanner(bannerId, bannerData, token) {
        const endpoint = `${config.url}/api/banners/${bannerId}/`;
        return await axios
            .put(endpoint, bannerData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
            .then((response) => response)
            .catch((error) => {
                throw error;
            });
    },

    // Bir banner'ı sil (DELETE işlemi için token gerekiyor)
    async deleteBanner(bannerId, token) {
        const endpoint = `${config.url}/api/banners/${bannerId}/`;
        return await axios
            .delete(endpoint, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
            .then((response) => response)
            .catch((error) => {
                throw error;
            });
    },
};

export default bannersAPI;
