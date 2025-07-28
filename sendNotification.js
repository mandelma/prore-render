const { GoogleAuth } = require('google-auth-library');
const axios = require('axios');
const path = require('path');

const YOUR_DEVICE_FCM_TOKEN = 'fWmsMeuKRgmwTAWuvv8xqV:APA91bGHo9GEcS5Vyo_o59i-tjKaMMf0xKktu_DzCu3OClQp-rdFSRavxdCNO1crIT0MxbCrFZZiYeEzjxltpO-hxd5a1AGd_EBmUlZCgAt7MAgykVkzqZs'
// Replace with your own details
const SERVICE_ACCOUNT_KEY_PATH = path.join(__dirname, 'firebase-key.json');
const FCM_SCOPE = 'https://www.googleapis.com/auth/firebase.messaging';
const DEVICE_TOKEN = YOUR_DEVICE_FCM_TOKEN; // <-- Replace this
const PROJECT_ID = 'prokeikkatori-9e9c7'; // <-- From firebase-key.json

async function getAccessToken() {
    const auth = new GoogleAuth({
        keyFile: SERVICE_ACCOUNT_KEY_PATH,
        scopes: [FCM_SCOPE],
    });

    const client = await auth.getClient();
    const accessToken = await client.getAccessToken();
    return accessToken.token;
}

async function sendNotification() {
    const accessToken = await getAccessToken();

    const url = `https://fcm.googleapis.com/v1/projects/${PROJECT_ID}/messages:send`;

    const message = {
        message: {
            token: DEVICE_TOKEN,
            notification: {
                title: 'Hello from Node.js',
                body: 'You got a test push notification!',
            },
        },
    };

    try {
        const response = await axios.post(url, message, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
                'Content-Type': 'application/json',
            },
        });

        console.log('✅ Notification sent successfully:');
        console.log(response.data);
    } catch (error) {
        console.error('❌ Error sending notification:', error.response?.data || error.message);
    }
}

sendNotification();
