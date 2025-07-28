const axios = require('axios');

import backendUrl from '@/url_config';
const baseUrl = `${backendUrl}/users`;


//const baseUrl = '/api/users'

const getAll = async () => {
    const response = await axios.get(baseUrl)
    return response.data
}

const getUser = async (id) => {
    const user = await axios.get(`${baseUrl}/${id}`);
    return user.data;
}

const addUser = async newUser => {
    const response = await axios.post(`${baseUrl}`, newUser)
    return response.data
}
// Uodate user email
const editEmail = async (id, email) => {
    const res = await axios.put(`${baseUrl}/${id}/updateEmail`, email);
    return res.data;
}
// Remove user avatar and name form server in assets
const removeAvatar = async (id) => {
    const av = await axios.put(`${baseUrl}/${id}/removeAvatar`, {avatar: {}});
    return av.data;
}

export default { getAll, getUser, addUser, editEmail, removeAvatar }