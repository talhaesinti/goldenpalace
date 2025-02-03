import axios from "axios";
import config from "../config";

const internationalToursAPI = {
    // Tüm yurt dışı turları listele (GET işlemi için token gerekmiyor)
    async getInternationalTours(params) {
        const endpoint = `${config.url}/api/international-tours/`;
        return await axios
            .get(endpoint, { params: params })
            .then((response) => response)
            .catch((error) => {
                throw error;
            });
    },

    // Belirli bir yurt dışı turun detayını al (GET işlemi için token gerekmiyor)
    async getInternationalTourDetail(tourId) {
        const endpoint = `${config.url}/api/international-tours/${tourId}/`;
        return await axios
            .get(endpoint)
            .then((response) => response)
            .catch((error) => {
                throw error;
            });
    },

    // Yeni bir yurt dışı tur oluştur (POST işlemi için token gerekiyor)
    async createInternationalTour(tourData, token) {
        const endpoint = `${config.url}/api/international-tours/`;
        return await axios
            .post(endpoint, tourData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
            .then((response) => response)
            .catch((error) => {
                throw error;
            });
    },

    // Mevcut bir yurt dışı turu güncelle (PUT işlemi için token gerekiyor)
    async updateInternationalTour(tourId, tourData, token) {
        const endpoint = `${config.url}/api/international-tours/${tourId}/`;
        return await axios
            .put(endpoint, tourData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
            .then((response) => response)
            .catch((error) => {
                throw error;
            });
    },

    // Bir yurt dışı turu sil (DELETE işlemi için token gerekiyor)
    async deleteInternationalTour(tourId, token) {
        const endpoint = `${config.url}/api/international-tours/${tourId}/`;
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

export default internationalToursAPI;
