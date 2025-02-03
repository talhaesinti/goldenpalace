import axios from "axios";
import config from "../config";

const authAPI = {
    // Kullanıcı kaydı (POST /register/)
    async registerUser(userData) {
        const endpoint = `${config.url}/register/`;
        return await axios
            .post(endpoint, userData)
            .then((response) => response)
            .catch((error) => {
                throw error;
            });
    },

    // Kullanıcı token alma (POST /token/)
    async loginUser(credentials) {
        const endpoint = `${config.url}/token/`;
        return await axios
            .post(endpoint, credentials)
            .then((response) => response)
            .catch((error) => {
                throw error;
            });
    },

    // Token yenileme (POST /token/refresh/)
    async refreshToken(refreshToken) {
        const endpoint = `${config.url}/token/refresh/`;
        return await axios
            .post(endpoint, { refresh: refreshToken })
            .then((response) => response)
            .catch((error) => {
                throw error;
            });
    },
};

export default authAPI;
