const axios = require('axios');
const log = require('./log');
const Constants = require('./constants');
const sendRequest = async (customerData, method, url, data) => {
    try {
        const accessToken = customerData?.credentials?.data?.access_token;
        const config = {
            method,
            url: url,
            headers: {
                'x-access-token': accessToken,
            },
            data,
        };
        const response = await axios(config);
        return response.data;
    } catch (error) {
        log.error('Axios Error:', error);
        throw error;
    }
};

const getSettings = async (endpoint) => {
    try {
        return await sendRequest(null, 'get', endpoint);
    } catch (error) {
        log.error('getSettings Error:', error);
        throw error;
    }
};

module.exports = {
    getSettings,
};
