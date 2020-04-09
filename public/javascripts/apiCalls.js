'use strict'

const axios = require('axios');

const API_URL_BASE = 'http://localhost:3000/api/v1';

const getAds = async (search) => {
    try {
        console.log('Entramos en getAds');
        console.log(`URL: ${API_URL_BASE}/anuncios${search}`);
        
        const endpoint = `${API_URL_BASE}/anuncios${search}`;
        //const endpoint = `${API_URL_BASE}anuncios${search}`;
        const response = await axios (endpoint, {
            method: 'GET',
            //withCredentials: true,
        });
        //const results = await response.data.results;
        const results = await response.data;

        console.log(`response: ${response}`);      
        console.log(`results: ${results}`);

        return results;
    } catch (error) {
        console.error("Error en apiCalls.js (getAds):");
        // console.error("Error getAds:", error);
        // console.error("Error getAds (error.response.data):", error.response.data);
        throw error;
        // throw error.response.data;
    }
}

module.exports = getAds;