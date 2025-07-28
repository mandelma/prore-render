const axios = require('axios');
import backendUrl from '@/url_config';
const baseUrl = `${backendUrl}/chatmessages`;
//const baseUrl = "/api/chatmessages";

const getMessages = () => {
    const messages = axios.get(baseUrl);
    return messages.data;
}

const getRoomMessages = async (room) => {
    const room_messages = await axios.get(`${baseUrl}/${room}`);
    return room_messages.data;
}

const editStatus = async (id, status) => {
    const res = await axios.put(`${baseUrl}/${id}`, status);
    return res.data;
}

const deleteRoomMessages = async (room) => {
    await axios.delete(`${baseUrl}/${room}`);
}


export default { getMessages, getRoomMessages, editStatus, deleteRoomMessages }