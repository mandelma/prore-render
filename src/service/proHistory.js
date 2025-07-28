const axios = require('axios');
import backendUrl from '@/url_config';
const baseUrl = `${backendUrl}/pro_history`;
//const baseUrl = '/api/pro_history'

const getProHistory = async () => {
    const history = await axios.get(baseUrl);
    return history.data;
}

const updateProHistory = async (history) => {
    const added = await axios.post(`${baseUrl}`, history);
    return added.data;
}

export default { getProHistory, updateProHistory };