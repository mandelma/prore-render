const axios = require('axios');
const baseUrl = '/api/agora';

const getToken = async (type) => {
    const token = await axios.get(`${baseUrl}/${type}`  );
    return token.data;
}

export default { getToken }