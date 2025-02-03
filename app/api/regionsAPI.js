import axios from "axios";
import config from "../config";

const regionsAPI = {
    // Tüm bölgeleri listele (GET işlemi için token gerekmiyor)
    async getRegions(params = {}) {
        const endpoint = `${config.url}/api/regions/`;
        return await axios
            .get(endpoint, { params })
            .then((response) => response)
            .catch((error) => {
                throw error;
            });
    },

    // Belirli bir bölgenin detayını al (GET işlemi için token gerekmiyor)
    async getRegionDetail(regionId) {
        const endpoint = `${config.url}/api/regions/${regionId}/`;
        return await axios
            .get(endpoint)
            .then((response) => response)
            .catch((error) => {
                throw error;
            });
    },

    // Yeni bir bölge oluştur (POST işlemi için token gerekiyor)
    async createRegion(regionData, token) {
        const endpoint = `${config.url}/api/regions/`;
        return await axios
            .post(endpoint, regionData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
            .then((response) => response)
            .catch((error) => {
                throw error;
            });
    },

    // Mevcut bir bölgeyi güncelle (PUT işlemi için token gerekiyor)
    async updateRegion(regionId, regionData, token) {
        const endpoint = `${config.url}/api/regions/${regionId}/`;
        return await axios
            .put(endpoint, regionData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
            .then((response) => response)
            .catch((error) => {
                throw error;
            });
    },

    // Bir bölgeyi sil (DELETE işlemi için token gerekiyor)
    async deleteRegion(regionId, token) {
        const endpoint = `${config.url}/api/regions/${regionId}/`;
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

export default regionsAPI;
