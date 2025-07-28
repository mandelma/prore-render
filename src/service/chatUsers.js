const axios = require('axios')
import backendUrl from '@/url_config';
const baseUrl = `${backendUrl}/chatusers`;
//const baseUrl = "/api/chatusers"
// http://localhost:3001s

const getAll = async () => {
    const response = await axios.get(baseUrl)
    return response.data
}

const getChatUser = async (id) => {
    const chatuser = await axios.get(`${baseUrl}/${id}`);
    return chatuser.data;
}

const updateStatus = async (id, status) => {
    const newStatus = await axios.put(`${baseUrl}/${id}`, status);
    return newStatus.data;
}
// isActive or not
const setDisplayChatUsers = async (room) => {
    const display = await axios.put(`${baseUrl}/${room}/is_active`);
    return display.data;
}
// Set counter
const reduceCounter = async (room) => {
    const counter = await axios.put(`${baseUrl}/${room}/reduce_counter`);
    return counter.data;
}

const removeChatMembersRoom = async (room) => {
    await axios.delete(`${baseUrl}/${room}`);
}

// const addUser = async newUser => {
//     const response = await axios.post(`${baseUrl}`, newUser)
//     return response.data
// }
// Remove user avatar and name form server in assets


export default { getAll, getChatUser, updateStatus, setDisplayChatUsers, reduceCounter, removeChatMembersRoom }