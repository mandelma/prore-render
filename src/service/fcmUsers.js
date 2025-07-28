const axios = require('axios');
//const baseUrl = "/api/fcm";

import backendUrl from '@/url_config';
const baseUrl = `${backendUrl}/fcm`;

const handleFcmToken = async(userID_token) => {
    const register = await axios.post(`${baseUrl}/register-token`, userID_token);
    return register.data;
}

const pushToUser = async (push_data) => {
    //const FCM_URL = `https://fcm.googleapis.com/v1/projects/${process.env.VUE_APP_FCM_PROJECT_ID}/messages:send`;
    const push = await axios.post(`${baseUrl}/push-to-user`, push_data);
    return push.data;
}

export default { handleFcmToken, pushToUser };