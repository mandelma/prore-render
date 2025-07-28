const axios = require('axios');
import backendUrl from '@/url_config';
const baseUrl = `${backendUrl}/offers`;
//const baseUrl = '/api/offers';

const getOffers = async () => {
    const offers = await axios.get(baseUrl);
    return offers.data;
}

const addFirstOffer = async (offer) => {
    const newOffer = await axios.post(`${baseUrl}`, offer);
    return newOffer.data;
}

const addAdditionalOffer = async (id, offer) => {
    const additionalOffer = await axios.post(`${baseUrl}/${id}`, offer);
    return additionalOffer.data;
}

const removeTimeOffer = async (providerId, offerId) => {
    const removedTimeRange = await axios.delete(`${baseUrl}/${providerId}/timeoffer/${offerId}`);
    return removedTimeRange.data;
}

const updateOffer = async (id, timeOffer) => {
    const updated = await axios.put(`${baseUrl}/${id}`, timeOffer)
    return updated.data
}

export default { getOffers, addFirstOffer, addAdditionalOffer, removeTimeOffer, updateOffer };