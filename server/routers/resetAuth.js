const resetRouter = require('express').Router()
const User = require('../models/users')
const nodemailer = require('nodemailer');
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
// const crypto = require('crypto');
// const bodyParser = require('body-parser');

// resetRouter.get('/', (req, res) => {
//     res.send("Hei!")
// })
// Route to initiate password reset
resetRouter.post('/forgot_auth',  async (req, res) => {
    const { email } = req.body;
    const user = await User.findOne({ email: email})
    //Check if the email exists in your user database
    if (user) {
        // Generate a reset token

        const tokenResetData = {
            username: user.username,
            id: user._id
        }

        const token_reset = jwt.sign(
            tokenResetData,
            process.env.SECRET,
            {expiresIn: "1h"})



        const url = req.protocol + '://' + req.get('host') + "/#";
        console.log("Url " + url)
        //  wtcb lhhd irwm nzfv

        const transporter = nodemailer.createTransport({
            //service: 'gmail',
            service: "Gmail",
            host: "smtp.gmail.com",
            port: 465,
            secure: false,
            auth: {
                user:  "prokeikkatori.info@gmail.com",     //'your-email@gmail.com',
                pass:  "wtcblhhdirwmnzfv"         //'your-email-password',
            },
        });
        const mailOptions = {
            from: "prokeikkatori.info@gmail.com",          //'your-email@gmail.com',
            to: email,
            subject: 'Uuden salasanan luominen',
            text: `Napsauta seuraavaa linkkiä luodaksesi uuden salasanan: ${url}/reset_auth/${token_reset}`,
        };



        // if (existingUser) {
        //     res.json({error: "username existing"})
        //     console.log("Is user existing? " + existingUser)
        // } else if (existingUserEmail) {
        //     res.json({error: "email existing"})
        // }
        // else {
        //     const savedUser = await user.save()
        //     console.log('saveduser: ', savedUser)
        //     res.json(savedUser)
        // }




        await transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.log(error);
                res.status(500).send('Error sending email');
            } else {
                console.log(`Email sent: ${info.response}`);
                //res.status(200).send('Tarkista sähköpostistasi ohjeet salasanan vaihtamiseen');
                res.status(200).json({result: 'Tarkista sähköpostistasi ohjeet salasanan vaihtamiseen'})
            }
        });
        user.tokenReset = token_reset;
        await user.save();
    } else {
        res.status(404).json({error: 'Email not found'});
    }

});

resetRouter.get('/', (req, res) => {
    const url = req.protocol + '://' + req.get('host') + "/login"
    res.send(url);
})

// Route to handle the reset token
resetRouter.get('/reset_auth/:token', async(req, res) => {
    const { token } = req.params;
    // Check if the token exists and is still valid
    const user = await User.findOne({tokenReset: token});
    try {
        if (user) {
            // Render a form for the user to enter a new password
            //res.send('<form method="post" action="/reset-password"><input type="password" name="password" required><input type="submit" value="Reset Password"></form>');
            const decodedToken = await jwt.verify(token, process.env.SECRET)
            if (!decodedToken) {
                //return res.status(401).json({ error: 'token invalid' })
                res.json({error: 'token expired'}).end();

            }
            res.status(200).send('valid')
            //res.send('valid')
            // } else {
            //     res.status(404).send('Invalid or expired token');
            // }
        } else {
            //res.status(404).send('Invalid or expired token');
            res.send('Lähetetty linkki on vanhentunut. Yrittä uudelleen!')
        }
    } catch (error) {
        console.log(error.message);
        res.send("Lähetetty linkki on vanhentunut. Yrittä uudelleen!");
    }


});
// Route to update the password
resetRouter.post('/reset_auth', async(req, res) => {
    const { token, password } = req.body;
    const saltRounds = 10

    console.log("Token: " + token);
    console.log("Password: " + password);
    //const user = await User.find({tokenReset: token})
    try {
        const user = await User.findOne({tokenReset: token})

        if(password === undefined || password === ''){
            return res.status(400).json({Error: 'Password field should not to be empty!'}).end()
        }
        //const passwordHash = await bcrypt.hash(password, saltRounds)

        user.passwordHash = await bcrypt.hash(password, saltRounds);

        user.tokenReset = null;

        await user.save();

        res.send('New password is created!')
        // Find the user with the given token and update their password
        // if (user) {
        //     console.log("Token: " + token);
        //
        //
        //     user.password = password;
        //     delete user.resetToken; // Remove the reset token after the password is updated
        //     res.status(200).send('Password updated successfully');
        // } else {
        //     res.status(404).send('Invalid or expired token');
        // }
    } catch (err) {
        res.send(err.message)
    }

});


module.exports = resetRouter;