let users = [];

// Join user to chat
// enne oli userID nüüd id
function userJoin(userID, username, room, connected) {
    const user = { userID, username, room, connected };
    if (user.username !== "") {
        //users.push(user);
        users = users.concat(user)



    }

    // aaa

    return user;
}

// Get current user
function getCurrentUser(id) {
    return users.find(user => user.userID === id);
}

function removeUser (id) {
    const user = getUser(id);
    if(user) {
        users = users.filter((user) => user.userID !== id);
    }
    return user;
}

const getUser = (id) => {
    const getuser = users.filter((userId) => {
        return userId.userID === id;
    })[0];
    return getuser;
}

// User leaves chat
function userLeave(id) {
    const index = users.findIndex(user => user.userID === id);

    if (index !== -1) {
        return users.splice(index, 1)[0];
    }

}

// Get room users
function getRoomUsers(room) {
    return users.filter(user => user.room === room);
}

module.exports = {
    userJoin,
    getCurrentUser,
    removeUser,
    userLeave,
    getRoomUsers
};
