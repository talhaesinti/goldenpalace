import axios from "axios";
import config from "../config";

const domesticToursAPI = {
    async getDomesticTours(params) {
        const endpoint = `${config.url}/api/domestic-tours/`;
        const queryParams = new URLSearchParams();
        
        if (params?.is_active !== undefined) {
            queryParams.append('is_active', params.is_active);
        }

        const url = queryParams.toString() 
            ? `${endpoint}?${queryParams.toString()}`
            : endpoint;

        return await axios
            .get(url)
            .then((response) => response)
            .catch((error) => {
                throw error;
            });
    },

    async getDomesticTourDetail(tourId) {
        const endpoint = `${config.url}/api/domestic-tours/${tourId}/`;
        return await axios
            .get(endpoint)
            .then((response) => response)
            .catch((error) => {
                throw error;
            });
    },

    async createDomesticTour(tourData, token) {
        const endpoint = `${config.url}/api/domestic-tours/`;
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

    async updateDomesticTour(tourId, tourData, token) {
        const endpoint = `${config.url}/api/domestic-tours/${tourId}/`;
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

    async deleteDomesticTour(tourId, token) {
        const endpoint = `${config.url}/api/domestic-tours/${tourId}/`;
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

export default domesticToursAPI;
