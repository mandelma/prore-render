const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const loginRouter = require('express').Router()
const User = require('../models/users')

loginRouter.post('/', async (request, response) => {
    const body = request.body

    const user = await User.findOne({username: body.username})
    const passwordCorrect = user === null
        ? false
        : await bcrypt.compare(body.password, user.passwordHash)

    if (!(user && passwordCorrect)) {
        // return response.status(401).json({
        //     error: 'invalid username or password'
        // })
        return response.send({error: "login error"})
    }

    const userForToken = {
        username: user.username,
        id: user._id
    }

    //const token = jwt.sign(userForToken, 'asdfghj')
    const token = jwt.sign(
        userForToken,
        process.env.SECRET,
        {expiresIn: "12h"})
    // expiresIn: "1h"
    response
        .status(200)
        .send({
            token,
            error: "no login error",
            id: user._id,
            username: user.username,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email

        })
})

// 60 * 60
// Validate token
loginRouter.post('/:token', async(req, res) => {
    //const decodedToken = jwt.verify(getTokenFrom(req), process.env.SECRET)

    try {
        const decodedToken = await jwt.verify(req.params.token, process.env.SECRET)
        if (!decodedToken) {
            //return res.status(401).json({ error: 'token invalid' })
            res.json({error: 'token invalid'})

        }

        res.status(200)
            .send({ result: decodedToken })
    } catch (err) {
        console.log(err.message)
        //return res.status(401).json({error: 'token expired'})
        res.json({result: 'token expired'})
    }

})

module.exports = loginRouter