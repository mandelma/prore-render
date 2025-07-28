const axios = require('axios')
import backendUrl from '@/url_config';
const baseUrl = `${backendUrl}/upload`;
//const baseUrl = '/api/upload'

const getAll = async () => {
    const result = await axios.get(baseUrl)
    return result.data
}

const createProRefImg = async (proID, imageData) => {
    const proRef = await axios.post(`${baseUrl}/${proID}/pro-ref-img`, imageData);
    return proRef.data;
}

const editProRefImage = async (imgID, newImage) => {
    const editProRef = await axios.put(`${baseUrl}/${imgID}/edit-pro-ref-image`, newImage);
    return editProRef.data;
}

const removeProRefImage = async (id, proId) => {
    await axios.delete(`${baseUrl}/${id}/del-pro-ref-image/${proId}`)
}

const create = async (newImageData) => {
    const result = await axios.post(baseUrl, newImageData, {})
    return result.data
}

// Create image for avatar
const createProfileImage =  async (id, imageData) => {
    const image = await axios.post(`${baseUrl}/${id}/avatar`, imageData);
    return image.data;
}

const createChatImage = async (imgData) => {
    const cImage = await axios.post(`${baseUrl}/chat-img`, imgData);
    return cImage.data;
}

const removeRoomChatImage = async (id) => {
    await axios.delete(`${baseUrl}/${id}/remove_chat_image`);
}

// Update user avatar
const newAvatar = async (id, avatar) => {
    const avt = await axios.post(`${baseUrl}/${id}/update_avatar`, avatar);
    return avt.data;
}

const updateImage = async (id, newImageData) => {
    const result = await axios.put(`${baseUrl}/${id}`, newImageData)
    return result.data
}

const remove = async (id, recipientId) => {
    await axios.delete(`${baseUrl}/${id}/delClientImg/${recipientId}`)
}

// Remove all images when resipient deleted
const cleanAllRecipientImages = async (id) => {
    await axios.delete(`${baseUrl}/${id}/delAllClientBookingImages`)
}

export default {
    getAll,
    createProRefImg,
    editProRefImage,
    removeProRefImage,
    create,
    createProfileImage,
    createChatImage,
    removeRoomChatImage,
    newAvatar,
    updateImage,
    remove,
    cleanAllRecipientImages
}