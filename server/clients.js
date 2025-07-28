const clients = [];

const addUser = ({ id, name, room }) => {
    name = name.trim().toLowerCase();
    room = room.trim().toLowerCase();

    const existingUser = clients.find((user) => {
        user.room === room && user.name === name
    });

    if (existingUser) {
        return { error: "Username is taken" };
    }
    const user = { id, name, room };

    clients.push(user);
    return { user };

}

const removeUser = (id) => {
    const index = clients.findIndex((user) => {
        user.id === id
    });

    if (index !== -1) {
        return clients.splice(index, 1)[0];
    }
}

const getUser = (id) => clients
    .find((user) => user.id === id);

const getUsersInRoom = (room) => clients
    .filter((user) => user.room === room);

module.exports = {
    addUser, removeUser,
    getUser, getUsersInRoom
};