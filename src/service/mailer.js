const axios = require('axios');
import backendUrl from '@/url_config';
const baseUrl = `${backendUrl}/new_message`;
//const baseUrl = '/api/new_message';

const notice = async (content) => {
    const newNotice = await axios.post(`${baseUrl}/mail`, content);
    return newNotice.data;
}

export default { notice };