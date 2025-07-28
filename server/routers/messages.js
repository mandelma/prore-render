
const messageRouter = require('express').Router();
const Messages = require('../models/messages');
const User = require('../models/users');

messageRouter.get('/', async (req, res) => {
    const messages = await Messages.find();
    res.send(messages);
})

messageRouter.post('/:id/message', async (req, res) => {
    const body = req.body;
    try {
        const user = await User.findById(req.params.id);

        // Check if message already exists
        const existingMessage = await Messages.findOne({
            bookingId: body.bookingId,
            sender: body.sender,
            content: body.content
        });

        if (existingMessage) {
            return res.status(409).send({ message: "Duplicate message", messageId: existingMessage._id });
        }

        const newMessage = new Messages({
            bookingId: body.bookingId,
            isNewMsg: body.isNewMsg,
            isLink: body.isLink,
            content: body.content,
            reason: body.reason,
            sender: body.sender,
            time: body.time
        })

        console.log("Reason " + body.reason);
        const createdNewMessage = await newMessage.save();
        user.messages = user.messages.concat(newMessage._id);
        await user.save();


        res.send(createdNewMessage);
    } catch (err) {
        console.log("Error: " + err.message);
        res.send({error: err.message});
    }
})

messageRouter.put('/:id/edit_message_status', async (req, res) => {
    try {

        const onEdit = await Messages.findByIdAndUpdate(
            req.params.id, req.body, {new: true}
        );
        res.send(onEdit);
    } catch (err) {
        console.log("Error: " + err.message);
        res.send({Error: "There was error to edit message status!"})
    }
})
// Remove message
messageRouter.delete('/:userID/remove_message/:messageID', async (req, res) => {
    try {
        await User.findOneAndUpdate(
            {_id: req.params.userID},
            {$pull: {messages: req.params.messageID}}
        );
        await Messages.findByIdAndDelete(req.params.messageID);
        res.status(204).end();
    } catch (err) {
        console.log("Error: " + err.message);
        res.send({Error: "No message was deleted!"})
    }
})

module.exports = messageRouter;