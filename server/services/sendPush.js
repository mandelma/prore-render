const admin = require('../firebase');

async function sendPush(tokens, title, body) {
    if (!tokens || tokens.length === 0) {
        return {error: 'No tokens to send'};
    }

    console.log("Tokens length; " + tokens.length)

    // const message = {
    //     tokens: ['fIVMMU92Qy6J0sKSyhyvS3:APA91bF32vL9BWisJfHe_oOaiXfsjXjfpTXycCsgnY2FdlKaA1NRpmSsRvfyrGKbOJSc4h54hBL2nr-AVmjjoneI9A7ZtFKTsWaAwRTIHNj1w4N4SLajznc'], // Array of device tokens
    //     notification: {
    //         // title: "Hello 👋",
    //         // body: "This is a test message",
    //         title: title,
    //         body: body
    //     },
    //
    // };
    //
    // const response = await admin.messaging().sendMulticast(message);
    const responses = await Promise.all(tokens.map(token => {
        console.log("+TOKEN+ " + token);
        return admin.messaging().send({
            token,
            notification: {
                title: title,
                body: body
            }
        });
    }));
    return responses;
}

module.exports = sendPush;