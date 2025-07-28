const router = require('express').Router()
const bcrypt = require('bcrypt')
const User = require('../models/users')
const ChatUser = require('../models/chatUsers')
const fs = require("fs");
const Provider = require("../models/providers");

router.get('/', async (req, res) => {
    const users = await User.find({})
    console.log("Users ", users)
    res.send(users)
})

router.get('/:id', async (req, res) => {
    try {
        const user = await User.findOne({_id: req.params.id})
            .populate('messages');
        res.json(user);
    } catch (err) {
        res.send({error: err.message});
        console.log("Error: " + err.message);

    }
})

router.post('/', async (req, res) => {
    try {
        const body = req.body
        const saltRounds = 10
        if(body.password === undefined || body.password === ''){
            return res.status(400).json({Error: 'Password field should not to be empty!'}).end()
        }
        const passwordHash = await bcrypt.hash(body.password, saltRounds)

        const user = new User({
            yritys: body.yritys,
            ytunnus: body.ytunnus,
            isAgreementAsClient: false,
            isAgreementAsPro: false,
            created: new Date(),
            username: body.username,
            firstName: body.firstName,
            lastName: body.lastName,
            email: body.email,
            avatar: {
                isImage: false,
                name: "avatar.png"
            },
            passwordHash
        })

        const existingUser = await User.findOne({username: body.username})
        const existingUserEmail = await User.findOne({email: body.email})

        if (existingUser) {
            res.json({error: "username existing"})
            console.log("Is user existing? " + existingUser)
        } else if (existingUserEmail) {
            res.json({error: "email existing"})
        }
        else {
            const savedUser = await user.save()
            console.log('saveduser: ', savedUser)
            res.json(savedUser)
        }

    }catch (exception) {
        console.log('Error: ', exception)
    }

})
// Update email
router.put('/:id/updateEmail', async (req, res) => {
    const { email } = req.body;
    console.log("Email params id " + req.params.id)
    console.log("email " + req.body.email)
    const emailExists = await User.findOne({email: email});
    try {
        if (emailExists) {
            res.json({error: "email existing"})
        } else {
            const newEmail = await User.findByIdAndUpdate(
                req.params.id, {email: email}, { new: true }
            )
            res.status(200).send(newEmail);
        }

    } catch (err) {
        console.log("Error " + err.message);
        res.send("There is an error to update email!")
    }
})


// Remove avatar object and image name from server
router.put('/:id/removeAvatar', async (req, res) => {
    const body = req.body
    const params = req.params;

    try {
        const user = await User.findById(params.id);
        const name = user.avatar.name;
        const updated = await User.findByIdAndUpdate(
            params.id, body, { new: true }
        )
        const avatar = {
            name: "avatar.png",
            image: "http://localhost:3001/uploads/avatar/avatar.png"
        }

        user.avatar = avatar;
        await user.save();

        fs.unlinkSync('./uploads/avatar/' + name);

        //await ChatUser.updateMany({ username: user.username }, { $set: { avatar: "" } });
        res.status(200).json(updated.toJSON())
    } catch (err) {
        console.log('Error: ', err)
    }
})

module.exports = router