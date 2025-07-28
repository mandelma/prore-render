const axios = require('axios')
import backendUrl from '@/url_config';
const baseUrl = `${backendUrl}/map`;
//const baseUrl = '/api/map'

const getLocation = async () => {
    const location = await axios.get(baseUrl)
    return location.data
}

export default {
    getLocation
}