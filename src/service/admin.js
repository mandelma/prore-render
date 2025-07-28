const axios = require('axios');
import backendUrl from '@/url_config';
const baseUrl = `${backendUrl}/admin`;
//const baseUrl = '/api/admin';

const getCompleted = async () => {
    const completed = await axios.get(baseUrl);
    return completed.data;
}

export default { getCompleted };