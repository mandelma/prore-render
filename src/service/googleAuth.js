const axios = require('axios')
//import axios from 'axios'
const baseUrl = "/auth/google"
// http://localhost:3001s

const getAll = async () => {
    const response = await axios.get(baseUrl)
    return response.data
}

const getUser = async () => {
    const res = await axios.get('/api/current_user');
    return res.data;
}

export default { getAll, getUser }