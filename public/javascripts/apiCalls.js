'use strict'

const axios = require('axios');

//const API_KEY = 'K8DSA0C-DKZ44V1-GEHS35S-R5ECFWV';
const API_URL_BASE = 'http://localhost:3000/api/v1';

const api = () => {
    return {
        getAds: async (search) => {
            try {
                const endpoint = `${API_URL_BASE}/anuncios${search}`;
                const response = await axios (endpoint, {
                    method: 'GET',
                    //withCredentials: true,
                });
                //const results = await response.data.results;
                const results = await response.data;
                return results;
            } catch (error) {
                console.error("Error en apiCalls.js (getAds):", error.message);
                throw error;
            }
        },
        getTags: async (search) => {
            try {
                const endpoint = `${API_URL_BASE}/tags${search}`;
                const response = await axios (endpoint, {
                    method: 'GET',
                    //withCredentials: true,
                });
                //const results = await response.data.results;
                const results = await response.data;
                return results;
            } catch (error) {
                console.error("Error en apiCalls.js (getTags):", error.message);
                throw error;
            }
        },
    };
};

//module.exports = getAds;
module.exports = api;