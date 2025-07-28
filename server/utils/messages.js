//const moment = require('moment');


function formatMessage(username, text) {
    return {
        username,
        text,
        time:  1223     //moment().format('h:mm a')
    };
}

module.exports = formatMessage;
