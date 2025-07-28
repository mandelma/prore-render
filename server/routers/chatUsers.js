const Router = require('express').Router();

const ChatUsers = require('../models/chatUsers')


Router.get('/:id', async (req, res) => {
    try {
        const chatUsers = await ChatUsers.find({member: {$elemMatch: {userID: req.params.id}}})
        res.send(chatUsers);
    } catch (err) {
        console.log("Error: " + err.message);
    }
})

Router.get('/:room/room-users', async (req, res) => {
    try {
        const roomUsers = await ChatUsers.find({room: req.params.room})
        res.send(roomUsers);
    } catch (err) {
        res.send({Error: "No users found!"})
    }
})

// Change chatuser active status ( for navbar to display )
Router.put('/:id', async (req, res) => {
    try {
        const userStatus = await ChatUsers.findByIdAndUpdate(
            req.params.id, req.body, {new: true}
        )
        res.send(userStatus);
    } catch (error) {
        console.log("Error: " + error.message);
    }
})
// Set chat room status active or not ( for visibility )
Router.put('/:room/is_active', async (req, res) => {
    try {
        const setRoomState = await ChatUsers.findOneAndUpdate(
            {room: req.params.room}, {isActive: req.body}
        )
        res.send(setRoomState);
    } catch (err) {
        console.log("Error: " + err.message);
    }
})

// Set counter value
Router.put('/:room/reduce_counter', async (req,res) => {
    try {
        const decreased = await ChatUsers.findOne({room: req.params.room});
        const counter = decreased.same_room_counter;
        if (counter !== 0) {
            decreased.same_room_counter = counter - 1;
            await decreased.save();
            res.send(decreased);
        }

    } catch (err) {
        console.log("Error: " + err.message);
    }
})

// Delete both one room users and room
Router.delete('/:room', async (req, res) => {
    try {
        console.log("Room id chatusers " + req.params.room);
        await ChatUsers.findOneAndDelete({room: req.params.room});
        res.status(204).end();
    } catch (err) {
        res.send("There was an error to delete chat room users!")
    }
})

module.exports = Router;